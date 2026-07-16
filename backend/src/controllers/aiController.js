export const askStudyBuddy = async (req, res, next) => {
  try {
    const { prompt } = req.body
    const user = req.user // Reads req.user set by protect
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' })
    }

    console.log(`AI query by user: ${user?.email || 'unknown'} (guest: ${!!user?.isGuest})`)

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not configured. Using backend heuristic fallback.')
      const fallbackReply = getHeuristicReply(prompt)
      return res.json({ reply: fallbackReply })
    }

    // Call Gemini API directly via HTTP post to avoid library mismatches
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, 5000)

    try {
      const response = await fetch(geminiUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are StudyBuddy, a helpful academic tutor for students at FUTA (Federal University of Technology, Akure). Keep your responses concise, highly informative, and formatted in markdown. Solve math/science problems step-by-step. Here is the student prompt: ${prompt}`
                }
              ]
            }
          ]
        })
      })

      clearTimeout(timeoutId)
      const data = await response.json()
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (reply) {
        return res.json({ reply })
      } else {
        throw new Error('Unexpected response format from Gemini API')
      }
    } catch (apiError) {
      clearTimeout(timeoutId)
      if (apiError.name === 'AbortError') {
        console.error('Gemini API request timed out (5s). Using backend fallback.')
      } else {
        console.error('Gemini API request failed. Using backend fallback:', apiError.message)
      }
      const fallbackReply = getHeuristicReply(prompt)
      return res.json({ reply: fallbackReply })
    }
  } catch (error) {
    next(error)
  }
}

// Simple fallback keyword replies for offline development
const getHeuristicReply = (prompt) => {
  const query = prompt.toLowerCase()

  if (query.includes('limit') || query.includes('lim (x')) {
    return "To calculate **lim (x → 2) (x² - 4) / (x - 2)**:\n\n1. Factoring the numerator gives: $(x - 2)(x + 2)$.\n2. We write the expression as: $\\frac{(x-2)(x+2)}{x-2}$.\n3. The $(x-2)$ term in the numerator and denominator cancel out.\n4. This leaves $(x + 2)$.\n5. Substitute $x = 2$: $2 + 2 = 4$.\n\nHence, the limit resolves to **4**."
  }

  if (query.includes('hybridisation') || query.includes('ch4') || query.includes('methane')) {
    return "Methane ($CH_4$) possesses **sp³ hybridisation**:\n\n* The central carbon atom has 4 valence electrons and forms 4 single $\\sigma$-bonds with hydrogen atoms.\n* According to VSEPR theory, these 4 bonding pairs arrange themselves to minimize repulsion, yielding a **tetrahedral molecular geometry** with bond angles of exactly **109.5°**."
  }

  if (query.includes('sin(θ) = 3/5') || query.includes('second quadrant') || query.includes('cos(θ)')) {
    return "For **sin(θ) = 3/5** in the second quadrant (90° < θ < 180°):\n\n1. Use the Pythagorean identity: $sin^2(\\theta) + cos^2(\\theta) = 1$.\n2. $(3/5)^2 + cos^2(\\theta) = 1 \\Rightarrow 9/25 + cos^2(\\theta) = 1$.\n3. $cos^2(\\theta) = 1 - 9/25 = 16/25$.\n4. Taking square root: $cos(\\theta) = \\pm 4/5$.\n5. Since cosine is **negative** in the second quadrant (quadrant II), we have: **cos(θ) = -4/5**."
  }

  return "I am **StudyBuddy AI**. To get custom AI answers in real-time, please set up the `GEMINI_API_KEY` in the server `.env` file! For now, remember to review past papers, formulate clear steps, and practice daily. Let me know what specific course you are working on!"
}
