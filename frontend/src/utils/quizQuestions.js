// Comprehensive Question Bank for StudyHub FUTA CBT Practice Simulator & Tech Quizzes

export const academicQuestions = {
  'MTH 101': [
    {
      id: 1,
      question: "If A = {x : x² - 5x + 6 = 0} and B = {2, 3}, which of the following is correct?",
      options: [
        "A is a proper subset of B (A ⊂ B)",
        "Set A is equal to Set B (A = B)",
        "A and B are disjoint sets (A ∩ B = ∅)",
        "A union B has 4 elements (A ∪ B = {2, 3, 5, 6})"
      ],
      correctAnswer: 1,
      explanation: "Solving the quadratic equation x² - 5x + 6 = 0 gives (x - 2)(x - 3) = 0, which means x = 2 or x = 3. Therefore, Set A = {2, 3}. Since Set B is also {2, 3}, A = B."
    },
    {
      id: 2,
      question: "Evaluate the limit: lim (x → 2) (x² - 4) / (x - 2).",
      options: ["0", "2", "4", "Undefined"],
      correctAnswer: 2,
      explanation: "Direct substitution yields 0/0, which is indeterminate. Factoring the numerator gives: (x - 2)(x + 2) / (x - 2). Canceling (x - 2) leaves (x + 2). Evaluating the limit as x → 2 gives 2 + 2 = 4."
    },
    {
      id: 3,
      question: "If sin(θ) = 3/5 and θ lies in the second quadrant (90° < θ < 180°), find cos(θ).",
      options: ["4/5", "-4/5", "-3/4", "3/4"],
      correctAnswer: 1,
      explanation: "Using the trigonometric identity sin²θ + cos²θ = 1, we get cos²θ = 1 - (3/5)² = 16/25. Thus cos(θ) = ±4/5. In the second quadrant, cosine is negative, so cos(θ) = -4/5."
    },
    {
      id: 4,
      question: "Find the 10th term of the Arithmetic Progression (AP): 5, 9, 13, 17, ...",
      options: ["37", "41", "45", "49"],
      correctAnswer: 1,
      explanation: "For an AP, the nth term is given by a_n = a + (n - 1)d. Here, first term a = 5, and common difference d = 9 - 5 = 4. For the 10th term: a_10 = 5 + (10 - 1)4 = 5 + 36 = 41."
    },
    {
      id: 5,
      question: "What is the value of the determinant of a 2x2 matrix A = [[3, 5], [2, 4]]?",
      options: ["2", "-2", "22", "14"],
      correctAnswer: 0,
      explanation: "The determinant of a matrix [[a, b], [c, d]] is calculated as (ad - bc). Here, det(A) = (3 * 4) - (5 * 2) = 12 - 10 = 2."
    },
    {
      id: 6,
      question: "Find the sum to infinity of the Geometric Progression (GP): 8, 4, 2, 1, ...",
      options: ["14", "15", "16", "Infinite"],
      correctAnswer: 2,
      explanation: "The sum to infinity of a GP is S_∞ = a / (1 - r) for |r| < 1. Here, first term a = 8 and common ratio r = 4 / 8 = 0.5. S_∞ = 8 / (1 - 0.5) = 8 / 0.5 = 16."
    },
    {
      id: 7,
      question: "If log₁₀(x) = 3, what is the value of x?",
      options: ["30", "100", "300", "1000"],
      correctAnswer: 3,
      explanation: "By definition of logarithms, log_b(y) = z is equivalent to b^z = y. Here, log₁₀(x) = 3 means x = 10³ = 1000."
    },
    {
      id: 8,
      question: "Differentiate y = x³ - 5x + 7 with respect to x.",
      options: ["3x² - 5", "3x² - 5x", "3x²", "x² - 5"],
      correctAnswer: 0,
      explanation: "Using the power rule of differentiation d/dx(x^n) = n*x^(n-1), the derivative of x³ is 3x², of -5x is -5, and of the constant 7 is 0. So, dy/dx = 3x² - 5."
    },
    {
      id: 9,
      question: "Calculate the distance between the points P(1, 2) and Q(4, 6) in a Cartesian plane.",
      options: ["3", "4", "5", "7"],
      correctAnswer: 2,
      explanation: "The distance formula is d = √((x₂ - x₁)² + (y₂ - y₁)²). Here, d = √((4 - 1)² + (6 - 2)²) = √(3² + 4²) = √(9 + 16) = √25 = 5."
    },
    {
      id: 10,
      question: "Resolve the quadratic equation x² - x - 6 = 0 for its roots.",
      options: ["x = -2, 3", "x = 2, -3", "x = 1, 6", "x = -1, 6"],
      correctAnswer: 0,
      explanation: "Factoring the quadratic expression: x² - x - 6 = (x - 3)(x + 2) = 0. Therefore, the roots are x = 3 and x = -2."
    }
  ],
  'PHY 101': [
    {
      id: 1,
      question: "A car accelerates uniformly from rest at a rate of 2 m/s² for 10 seconds. Find the distance covered.",
      options: ["10 meters", "20 meters", "100 meters", "200 meters"],
      correctAnswer: 2,
      explanation: "Using the equation of motion s = ut + 0.5*at², where initial velocity u = 0, acceleration a = 2 m/s², and time t = 10 s: s = 0 + 0.5 * 2 * (10)² = 100 meters."
    },
    {
      id: 2,
      question: "Which of the following represents a scalar quantity?",
      options: ["Velocity", "Force", "Displacement", "Kinetic Energy"],
      correctAnswer: 3,
      explanation: "A scalar quantity has magnitude only, with no direction. Kinetic energy, temperature, and mass are scalar. Velocity, force, and displacement are vector quantities as they include direction."
    },
    {
      id: 3,
      question: "What is the dimension of Force in terms of Mass (M), Length (L), and Time (T)?",
      options: ["MLT⁻¹", "MLT⁻²", "ML²T⁻²", "ML⁻¹T⁻²"],
      correctAnswer: 1,
      explanation: "Force = Mass * Acceleration. Acceleration has dimensions [LT⁻²]. Therefore, Force has dimensions [M] * [LT⁻²] = MLT⁻²."
    },
    {
      id: 4,
      question: "According to Newton's Third Law of Motion, action and reaction forces:",
      options: [
        "Act on the same body in opposite directions",
        "Act on different bodies in the same direction",
        "Act on different bodies in opposite directions",
        "Cancel each other out completely"
      ],
      correctAnswer: 2,
      explanation: "Newton's Third Law states that for every action, there is an equal and opposite reaction. These forces always act on two different interacting bodies in opposite directions, so they never act on the same body."
    },
    {
      id: 5,
      question: "A ball is thrown horizontally from the top of a cliff. Neglecting air resistance, its vertical acceleration is:",
      options: ["Zero", "Constant and equal to g", "Decreasing as it falls", "Increasing as it falls"],
      correctAnswer: 1,
      explanation: "In projectile motion, horizontal acceleration is zero, while vertical acceleration is constant and equal to the acceleration due to gravity (g = 9.8 m/s² downwards) throughout the flight."
    },
    {
      id: 6,
      question: "Calculate the work done when a force of 50 N pushes a crate through a distance of 5 meters in the direction of the force.",
      options: ["10 Joules", "25 Joules", "250 Joules", "500 Joules"],
      correctAnswer: 2,
      explanation: "Work done W = F * d * cos(θ). Since the movement is in the direction of the force, θ = 0° and cos(0°) = 1. W = 50 N * 5 m * 1 = 250 Joules."
    },
    {
      id: 7,
      question: "What is the escape velocity of an object from the Earth's surface approximately?",
      options: ["9.8 km/s", "11.2 km/s", "42.0 km/s", "1.12 km/s"],
      correctAnswer: 1,
      explanation: "The escape velocity from Earth's surface is given by v_e = √(2GR/R) which is approximately 11.2 km/s (or 11,200 m/s)."
    },
    {
      id: 8,
      question: "A particle moves in a circle of radius 2 m with a constant speed of 4 m/s. What is its centripetal acceleration?",
      options: ["2 m/s²", "4 m/s²", "8 m/s²", "16 m/s²"],
      correctAnswer: 2,
      explanation: "Centripetal acceleration is given by a_c = v² / r. Here, v = 4 m/s and r = 2 m. Therefore, a_c = (4)² / 2 = 16 / 2 = 8 m/s²."
    },
    {
      id: 9,
      question: "Which type of collision conserves both momentum and kinetic energy?",
      options: ["Perfect Elastic Collision", "Inelastic Collision", "Perfect Inelastic Collision", "Explosive Collision"],
      correctAnswer: 0,
      explanation: "In a perfectly elastic collision, both total linear momentum and total kinetic energy of the system are conserved. In inelastic collisions, only momentum is conserved; kinetic energy is partially converted into heat/sound."
    },
    {
      id: 10,
      question: "What is the angular speed of the second hand of a mechanical clock?",
      options: ["π rad/s", "2π rad/s", "π/30 rad/s", "π/60 rad/s"],
      correctAnswer: 2,
      explanation: "The second hand completes one full revolution (2π radians) in 60 seconds. Angular speed ω = 2π / T = 2π / 60 = π/30 rad/s."
    }
  ],
  'CHM 101': [
    {
      id: 1,
      question: "What is the hybridisation of the carbon atom in a molecule of methane (CH₄)?",
      options: ["sp", "sp²", "sp³", "sp³d"],
      correctAnswer: 2,
      explanation: "In methane (CH₄), the central carbon atom forms 4 single sigma bonds with hydrogen atoms and has no lone pairs. This tetrahedral geometry corresponds to sp³ hybridisation."
    },
    {
      id: 2,
      question: "According to Boyles's Law, the volume of a fixed mass of gas is:",
      options: [
        "Directly proportional to its temperature at constant pressure",
        "Inversely proportional to its pressure at constant temperature",
        "Directly proportional to its pressure at constant temperature",
        "Inversely proportional to its temperature at constant pressure"
      ],
      correctAnswer: 1,
      explanation: "Boyle's Law states that for a fixed mass of gas at constant temperature, the volume (V) is inversely proportional to its pressure (P), meaning P * V = Constant."
    },
    {
      id: 3,
      question: "What is the oxidation state of sulfur in sulfuric acid (H₂SO₄)?",
      options: ["+2", "+4", "+6", "-2"],
      correctAnswer: 2,
      explanation: "In H₂SO₄, the sum of oxidation numbers is 0. H is +1, O is -2. So: 2(+1) + S + 4(-2) = 0 => 2 + S - 8 = 0 => S - 6 = 0 => S = +6."
    },
    {
      id: 4,
      question: "Which of the following elements has the highest electronegativity?",
      options: ["Oxygen", "Fluorine", "Chlorine", "Nitrogen"],
      correctAnswer: 1,
      explanation: "Fluorine is the most electronegative element in the periodic table, with a value of approximately 4.0 on the Pauling scale, due to its small atomic size and high effective nuclear charge."
    },
    {
      id: 5,
      question: "How many moles of atoms are contained in 23 grams of sodium (Na)? [Atomic mass of Na = 23 g/mol]",
      options: ["0.5 moles", "1.0 mole", "2.0 moles", "6.02 x 10²³ moles"],
      correctAnswer: 1,
      explanation: "Moles = Mass (g) / Molar Mass (g/mol). Moles of Na = 23 g / 23 g/mol = 1.0 mole of sodium atoms."
    },
    {
      id: 6,
      question: "Which type of chemical bond involves the complete transfer of electrons from one atom to another?",
      options: ["Covalent Bond", "Dative/Coordinate Bond", "Ionic Bond", "Metallic Bond"],
      correctAnswer: 2,
      explanation: "An ionic bond is formed through the electrostatic attraction between oppositely charged ions, which occurs when valence electrons are transferred from a metal to a non-metal."
    },
    {
      id: 7,
      question: "What is the pH of a 0.001 M solution of hydrochloric acid (HCl)?",
      options: ["1", "2", "3", "11"],
      correctAnswer: 2,
      explanation: "HCl is a strong acid that dissociates completely, so [H⁺] = 0.001 M = 10⁻³ M. The pH is calculated as -log₁₀[H⁺] = -log₁₀(10⁻³) = 3."
    },
    {
      id: 8,
      question: "Which subatomic particle has a relative charge of 0 and a mass of approximately 1 amu?",
      options: ["Proton", "Electron", "Neutron", "Positron"],
      correctAnswer: 2,
      explanation: "Neutrons are neutral subatomic particles located in the atomic nucleus, possessing a relative charge of 0 and a mass of roughly 1 atomic mass unit (amu). Protons are positive (+1) and electrons are negative (-1) with negligible mass."
    },
    {
      id: 9,
      question: "Which gas law states that equal volumes of all gases at the same temperature and pressure contain equal number of molecules?",
      options: ["Charles's Law", "Gay-Lussac's Law", "Graham's Law", "Avogadro's Law"],
      correctAnswer: 3,
      explanation: "Avogadro's Law states that under equal conditions of temperature and pressure, equal volumes of gases contain an equal number of molecules (V ∝ n)."
    },
    {
      id: 10,
      question: "What is the shape of a water (H₂O) molecule?",
      options: ["Linear", "Bent or V-shaped", "Trigonal Planar", "Tetrahedral"],
      correctAnswer: 1,
      explanation: "Although water has 4 electron pairs around oxygen (giving a tetrahedral arrangement), 2 of these are lone pairs. The molecular shape (positions of the atoms) is bent or V-shaped with a bond angle of about 104.5°."
    }
  ],
  'CSC 201': [
    {
      id: 1,
      question: "Convert the binary number 1011₂ to its decimal equivalent.",
      options: ["9", "11", "13", "15"],
      correctAnswer: 1,
      explanation: "1011₂ = (1 * 2³) + (0 * 2²) + (1 * 2¹) + (1 * 2⁰) = 8 + 0 + 2 + 1 = 11 in decimal."
    },
    {
      id: 2,
      question: "In flowcharting, what does the diamond-shaped symbol represent?",
      options: ["Process / Operation", "Start / End", "Input / Output", "Decision"],
      correctAnswer: 3,
      explanation: "In standard flowcharts, a diamond symbol indicates a decision point (conditional check) which branches the program flow depending on a Yes/No or True/False outcome."
    },
    {
      id: 3,
      question: "Which of the following is a high-level programming language?",
      options: ["Machine Language", "Assembly Language", "Python", "Hexadecimal Code"],
      correctAnswer: 2,
      explanation: "Python, C++, Java, and Fortran are high-level programming languages that are readable by humans. Machine language and assembly language are low-level languages closer to machine instructions."
    },
    {
      id: 4,
      question: "What is the hexadecimal equivalent of the decimal number 15?",
      options: ["E", "F", "10", "A"],
      correctAnswer: 1,
      explanation: "The hexadecimal system (base 16) uses numbers 0-9 and letters A-F to represent values 10-15. Therefore, decimal 15 corresponds to the letter F in hexadecimal."
    },
    {
      id: 5,
      question: "Which data structure follows the First-In, First-Out (FIFO) principle?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      correctAnswer: 1,
      explanation: "A queue operates on the First-In, First-Out (FIFO) principle, where the first element added is the first to be removed. A stack follows Last-In, First-Out (LIFO)."
    },
    {
      id: 6,
      question: "What is the function of a Compiler in programming?",
      options: [
        "Executes a program line by line",
        "Converts high-level source code to machine code all at once",
        "Edits text files of programs",
        "Finds logic errors in algorithms"
      ],
      correctAnswer: 1,
      explanation: "A compiler translates the entire high-level source code of a program into machine code (object code) prior to execution. An interpreter, conversely, translates and executes the code line by line."
    },
    {
      id: 7,
      question: "Which of the following loop structures executes its block at least once before testing the condition?",
      options: ["while loop", "for loop", "do-while loop", "if-else loop"],
      correctAnswer: 2,
      explanation: "A do-while loop executes its body first, and then evaluates the conditional statement at the end of the loop. This guarantees the body is run at least once."
    },
    {
      id: 8,
      question: "What is the size of a standard floating-point float variable in C/C++?",
      options: ["1 byte", "2 bytes", "4 bytes", "8 bytes"],
      correctAnswer: 2,
      explanation: "In most modern standard architectures, a float variable takes up 4 bytes (32 bits) of memory, while a double takes 8 bytes (64 bits)."
    },
    {
      id: 9,
      question: "What is the value of the expression 17 % 5 in Python or C++?",
      options: ["3", "2", "1", "0.4"],
      correctAnswer: 1,
      explanation: "The modulus operator (%) returns the remainder of the integer division. 17 divided by 5 is 3 with a remainder of 2. Therefore, 17 % 5 = 2."
    },
    {
      id: 10,
      question: "Which of the following is NOT a valid variable name in most programming languages?",
      options: ["student_age", "age2", "_score", "2ndPlace"],
      correctAnswer: 3,
      explanation: "Variable names in most programming languages cannot begin with a digit. Therefore, '2ndPlace' is invalid, whereas identifiers starting with letters or underscores are valid."
    }
  ],
  'GST 111': [
    {
      id: 1,
      question: "Choose the correct spelling of the following word:",
      options: ["Accomodation", "Accommodation", "Acomodation", "Accomodasion"],
      correctAnswer: 1,
      explanation: "The correct spelling is 'Accommodation', containing double 'c' and double 'm'."
    },
    {
      id: 2,
      question: "Identify the part of speech of the underlined word: She ran **quickly** to catch the bus.",
      options: ["Adjective", "Verb", "Preposition", "Adverb"],
      correctAnswer: 3,
      explanation: "'Quickly' describes the manner in which the verb 'ran' was performed, which makes it an Adverb. Adverbs typically modify verbs, adjectives, or other adverbs."
    },
    {
      id: 3,
      question: "Which of the following sentences exhibits the correct subject-verb agreement?",
      options: [
        "Neither the teacher nor the students is present.",
        "Neither the teacher nor the students are present.",
        "Every one of the boys have a textbook.",
        "A fleet of ships are approaching the harbor."
      ],
      correctAnswer: 1,
      explanation: "When subject parts are connected by 'or' or 'nor', the verb agrees with the closer subject. Since 'students' (plural) is closer to the verb, 'are' is correct. Also, 'every one' requires singular 'has', and 'fleet' (collective noun acting as one unit) requires singular 'is'."
    },
    {
      id: 4,
      question: "Select the option that is the synonym of the word: **Candid**",
      options: ["Deceptive", "Honest / Frank", "Secretive", "Vague"],
      correctAnswer: 1,
      explanation: "'Candid' means truthful, straightforward, and frank. The closest synonym is 'Honest / Frank'. Deceptive and secretive are antonyms."
    },
    {
      id: 5,
      question: "Identify the correct punctuation for this sentence:",
      options: [
        "Its a long way to the library, isn't it.",
        "It's a long way to the library, isn't it?",
        "It's a long way to the library isn't it.",
        "Its a long way to the library, isn't it?"
      ],
      correctAnswer: 1,
      explanation: "'It's' is the contraction of 'It is', and the sentence ends with a tag question, requiring a comma before the tag and a question mark at the end."
    },
    {
      id: 6,
      question: "What is the antonym of the word: **Abundant**",
      options: ["Scarce", "Plentiful", "Ample", "Copious"],
      correctAnswer: 0,
      explanation: "'Abundant' means existing or available in large quantities. Its opposite is 'Scarce' (deficient in quantity). Plentiful, ample, and copious are synonyms."
    },
    {
      id: 7,
      question: "Complete the sentence: If I ______ you, I would study harder for the examination.",
      options: ["was", "were", "am", "be"],
      correctAnswer: 1,
      explanation: "This is a second conditional sentence (expressing an imaginary or hypothetical situation). In subjunctive mood clauses, 'were' is used for all subject pronouns, including 'I'."
    },
    {
      id: 8,
      question: "Choose the active voice equivalent of: 'The lesson was explained by the lecturer.'",
      options: [
        "The lecturer explains the lesson.",
        "The lecturer explained the lesson.",
        "The lecturer had explained the lesson.",
        "The lecturer was explaining the lesson."
      ],
      correctAnswer: 1,
      explanation: "The passive sentence 'was explained' is in simple past tense. The active form must also use simple past tense: 'The lecturer explained the lesson.'"
    },
    {
      id: 9,
      question: "What is the meaning of the idiom: 'To spill the beans'?",
      options: [
        "To drop something valuable",
        "To perform a clumsy action",
        "To reveal a secret prematurely",
        "To waste food"
      ],
      correctAnswer: 2,
      explanation: "The idiom 'to spill the beans' means to disclose confidential information or a secret, often unintentionally or before the intended time."
    },
    {
      id: 10,
      question: "Which of the following is a coordinating conjunction?",
      options: ["Although", "Because", "But", "Since"],
      correctAnswer: 2,
      explanation: "Coordinating conjunctions connect words, phrases, or clauses of equal rank. They can be remembered with the acronym FANBOYS (For, And, Nor, But, Or, Yet, So). 'But' is coordinating, whereas 'Although', 'Because', and 'Since' are subordinating."
    }
  ]
}

export const techQuestions = {
  'Computer Science': [
    {
      id: 1,
      question: "What does the abbreviation 'API' stand for in software engineering?",
      options: [
        "Application Programming Interface",
        "Automated Process Integration",
        "Alloy Programming Instruction",
        "Analytical Product Identifier"
      ],
      correctAnswer: 0,
      explanation: "API stands for Application Programming Interface. It is a set of definitions and protocols that allows different software applications to communicate with each other."
    },
    {
      id: 2,
      question: "In Git, which command is used to record file snapshots permanently in version history?",
      options: ["git add", "git commit", "git push", "git save"],
      correctAnswer: 1,
      explanation: "`git commit` takes staged changes and records them as a permanent snapshot in the local repository history. `git add` stages changes, and `git push` uploads them to a remote server."
    },
    {
      id: 3,
      question: "Which of the following database types is categorised as 'NoSQL'?",
      options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite"],
      correctAnswer: 2,
      explanation: "MongoDB is a document-oriented NoSQL database. MySQL, PostgreSQL, and SQLite are Relational Database Management Systems (RDBMS) which use SQL."
    },
    {
      id: 4,
      question: "Which AI architecture serves as the foundation for modern Large Language Models (LLMs) like GPT-4 and Claude?",
      options: [
        "Convolutional Neural Networks (CNN)",
        "Recurrent Neural Networks (RNN)",
        "Transformer Architecture",
        "Support Vector Machines (SVM)"
      ],
      correctAnswer: 2,
      explanation: "The Transformer architecture, introduced by Google researchers in 2017 ('Attention Is All You Need'), is the underlying deep learning architecture that powers modern LLMs."
    },
    {
      id: 5,
      question: "Which cloud service provider operates the AWS computing platform?",
      options: ["Microsoft", "Google", "Amazon", "IBM"],
      correctAnswer: 2,
      explanation: "AWS stands for Amazon Web Services, which is a subsidiary of Amazon providing on-demand cloud computing platforms and APIs."
    }
  ],
  'Engineering': [
    {
      id: 1,
      question: "Which element is primarily alloyed with iron to produce stainless steel?",
      options: ["Copper", "Chromium", "Zinc", "Aluminum"],
      correctAnswer: 1,
      explanation: "Stainless steel is steel alloyed with at least 10.5% Chromium. The chromium reacts with oxygen to form a thin, protective passive layer of chromium oxide that prevents rust."
    },
    {
      id: 2,
      question: "In electrical engineering, Ohm's law relates voltage (V), current (I), and resistance (R) as:",
      options: ["V = I / R", "V = I * R", "I = V * R", "R = I * V"],
      correctAnswer: 1,
      explanation: "Ohm's Law states that Voltage (V) is directly proportional to Current (I) times Resistance (R). So, V = IR."
    },
    {
      id: 3,
      question: "Which type of engine is standard in commercial electric vehicles like Tesla?",
      options: [
        "Internal Combustion Engine",
        "Steam Turbine",
        "AC Induction or Permanent Magnet Synchronous Motor",
        "Pneumatic Rotary Motor"
      ],
      correctAnswer: 2,
      explanation: "Electric vehicles (EVs) utilize AC induction motors or permanent magnet synchronous electric motors to convert electrical energy from the battery into mechanical energy."
    },
    {
      id: 4,
      question: "What is the primary function of a civil engineering retaining wall?",
      options: [
        "To harvest solar energy",
        "To support bridges across rivers",
        "To resist lateral pressure of soil or earth slope",
        "To filter pollutants from rainwater drainage"
      ],
      correctAnswer: 2,
      explanation: "Retaining walls are structures designed to bound soils between two different elevations, resisting the lateral pressure of soil when there is a desired change in ground elevation."
    }
  ],
  'Science': [
    {
      id: 1,
      question: "What does the biotechnology term 'CRISPR' stand for in genetics?",
      options: [
        "Clustered Regularly Interspaced Short Palindromic Repeats",
        "Chromatin Recombination Interspersed Sequence Processing Review",
        "Cellular Ribosome Inhibitor and Protein Synthesizer",
        "Critical Restriction Interspersed Sequence Primer"
      ],
      correctAnswer: 0,
      explanation: "CRISPR stands for Clustered Regularly Interspaced Short Palindromic Repeats. It is a gene-editing technology that allows scientists to make precise edits to genomic DNA."
    },
    {
      id: 2,
      question: "What is the name of NASA's active Mars rover that landed in February 2021?",
      options: ["Curiosity", "Opportunity", "Perseverance", "Sojourner"],
      correctAnswer: 2,
      explanation: "NASA's Perseverance rover landed in Jezero Crater on Mars on February 18, 2021, to search for signs of ancient microbial life and collect rock samples."
    },
    {
      id: 3,
      question: "Which element constitutes approximately 78% of the Earth's atmosphere by volume?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"],
      correctAnswer: 2,
      explanation: "Earth's atmosphere is composed of approximately 78% Nitrogen, 21% Oxygen, 0.9% Argon, and trace amounts of other gases including carbon dioxide."
    },
    {
      id: 4,
      question: "What is the primary power generation mechanism inside the core of the Sun?",
      options: ["Nuclear Fission", "Nuclear Fusion", "Chemical Combustion", "Gravitational Collapse"],
      correctAnswer: 1,
      explanation: "The Sun generates energy through nuclear fusion in its core, combining hydrogen nuclei (protons) to form helium atoms. This process releases massive amounts of energy according to E=mc²."
    }
  ]
}
