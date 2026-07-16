import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AskStudyBuddy = ({ isOpen, onClose, initialQuery = '' }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am **StudyBuddy AI**, your FUTA exam coach. I can help explain math steps, physics derivations, chemistry bonds, or general study guidelines. Ask me anything!"
    }
  ])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  // Handle initial queries (e.g. from CBT corrections panel)
  useEffect(() => {
    if (isOpen && initialQuery) {
      // Avoid duplicating the initial message if already sent
      const alreadySent = messages.some(msg => msg.text === initialQuery)
      if (!alreadySent) {
        handleSendMessage(initialQuery)
      }
    }
  }, [isOpen, initialQuery])

  const handleSendMessage = async (queryText) => {
    const textToSend = queryText || inputText
    if (!textToSend.trim()) return

    // Add user message
    const userMsg = { sender: 'user', text: textToSend }
    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setLoading(true)

    try {
      // 1. Attempt calling the backend AI endpoint
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      
      const response = await axios.post(
        `${apiUrl}/ai/ask`,
        { prompt: textToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (response.data?.reply) {
        setMessages(prev => [...prev, { sender: 'ai', text: response.data.reply }])
        setLoading(false)
      } else {
        throw new Error('No reply in server response')
      }
    } catch (error) {
      console.warn('AI API failed. Falling back to local offline StudyBuddy rules:', error)
      // 2. Local fallback heuristic rules
      const aiReply = getLocalTutorResponse(textToSend)
      // Short delay to simulate thinking
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'ai', text: aiReply }])
        setLoading(false)
      }, 800)
    }
  }

  // Smart client-side keyword mapper
  const getLocalTutorResponse = (query) => {
    const text = query.toLowerCase()

    if (text.includes('limit') || text.includes('lim (x')) {
      return "To calculate **lim (x → 2) (x² - 4) / (x - 2)**:\n\n1. Factoring the numerator gives: $(x - 2)(x + 2)$.\n2. We write the expression as: $\\frac{(x-2)(x+2)}{x-2}$.\n3. The $(x-2)$ term in the numerator and denominator cancel out.\n4. This leaves $(x + 2)$.\n5. Substitute $x = 2$: $2 + 2 = 4$.\n\nHence, the limit resolves to **4**."
    }

    if (text.includes('hybridisation') || text.includes('ch4') || text.includes('methane')) {
      return "Methane ($CH_4$) possesses **sp³ hybridisation**:\n\n* The central carbon atom has 4 valence electrons and forms 4 single $\\sigma$-bonds with hydrogen atoms.\n* According to VSEPR theory, these 4 bonding pairs arrange themselves to minimize repulsion, yielding a **tetrahedral molecular geometry** with bond angles of exactly **109.5°**."
    }

    if (text.includes('sin(θ) = 3/5') || text.includes('second quadrant') || text.includes('cos(θ)')) {
      return "For **sin(θ) = 3/5** in the second quadrant (90° < θ < 180°):\n\n1. Use the Pythagorean identity: $sin^2(\\theta) + cos^2(\\theta) = 1$.\n2. $(3/5)^2 + cos^2(\\theta) = 1 \\Rightarrow 9/25 + cos^2(\\theta) = 1$.\n3. $cos^2(\\theta) = 1 - 9/25 = 16/25$.\n4. Taking square root: $cos(\\theta) = \\pm 4/5$.\n5. Since cosine is **negative** in the second quadrant (quadrant II), we have: **cos(θ) = -4/5**."
    }

    if (text.includes('quadratic') || text.includes('x² - 5x + 6') || text.includes('sets')) {
      return "To solve **x² - 5x + 6 = 0**:\n\n1. Find two numbers that multiply to $+6$ and add to $-5$. These are $-2$ and $-3$.\n2. Factor the equation: $(x - 2)(x - 3) = 0$.\n3. Solve for x: $x = 2$ or $x = 3$.\n\nThus, Set A = {2, 3}, which is equal to Set B. Hence **A = B**."
    }

    if (text.includes('accelerate') || text.includes('car') || text.includes('distance covered')) {
      return "For a car accelerating from rest at **2 m/s² for 10 seconds**:\n\n1. Use the second equation of motion: $s = ut + 0.5 a t^2$.\n2. Since it starts from rest, initial velocity $u = 0$.\n3. Plug in variables: $s = (0 * 10) + 0.5 * 2 * (10)^2$.\n4. $s = 0 + 1 * 100 = 100$ meters.\n\nSo, the distance covered is **100 meters**."
    }

    if (text.includes('compile') || text.includes('compiler')) {
      return "A **Compiler** translates high-level programming instructions (like C++, Java, Rust) into low-level machine code *all at once* before execution. This produces an executable file (e.g. `.exe` on Windows). An **Interpreter**, on the other hand, translates and runs code *line-by-line* during execution (like Python, PHP)."
    }

    if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
      return "Hello! How can I assist you with your studies today? You can ask me to explain course questions, provide exam strategies, or give motivational advice!"
    }

    if (text.includes('study') || text.includes('exam') || text.includes('morale') || text.includes('burnout')) {
      return "Staying focused takes discipline, not just motivation. Here is a quick strategy:\n\n1. **Use the Pomodoro Technique**: Study for 25 minutes, then take a 5-minute stretch break.\n2. **Practice Active Recall**: Don't just re-read notes. Close them and write down everything you remember.\n3. **Review Past Questions**: FUTA exams often repeat patterns. Familiarize yourself with their structural formatting."
    }

    return "That's an interesting question! To give you a detailed explanation, make sure to set the `GEMINI_API_KEY` in the backend environment file. For now, remember that consistent practice, checking past questions, and breaking down complex formulas into smaller parts is the key to mastering this course."
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 z-[80] w-80 sm:w-96 bg-white shadow-2xl flex flex-col border-l border-gray-200 transform transition-transform duration-300 translate-x-0 animate-in slide-in-from-right">
      {/* Chat Header */}
      <div className="bg-purple-brand text-white p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          <div>
            <h3 className="font-bold text-sm">StudyBuddy AI Tutor</h3>
            <span className="text-[10px] text-purple-200 font-semibold block">Gemini-Powered Academic Coach</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:text-purple-200 transition-colors p-1"
          aria-label="Close Chat"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-purple-brand text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}>
              {/* Parse markdown-like bold indicators */}
              <p className="whitespace-pre-line">
                {msg.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="font-extrabold">{part}</strong> : part)}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-gray-500 shadow-sm flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span>StudyBuddy is thinking...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask StudyBuddy a question..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="px-3.5 py-2 btn-purple text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-semibold disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default AskStudyBuddy
