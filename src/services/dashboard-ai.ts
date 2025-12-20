import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIResponse, PageName, NoteGenerationConfig, GeneratedNoteContent } from '../types';

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const genAI = new GoogleGenerativeAI(process.env.API_KEY || '');

// Mock fallback function
const getMockDashboardGuidance = (page: PageName): AIResponse => {
  switch (page) {
    case 'dashboard_home':
      return {
        page: 'dashboard_home',
        actions: [
          "Study 'Newton's Laws' today",
          "Review yesterday's timeline session",
          "Check your notification inbox"
        ],
        quick_suggestions: [
          "You're on a 3-day streak! Keep it up.",
          "Try the Focus Mode for your next session."
        ]
      };
    case 'notes_library':
      return {
        page: 'notes_library',
        actions: [
          "Organize Physics notes into folders",
          "Rename 'IMG_2024.jpg' to a proper topic",
          "Upload your latest homework PDF"
        ],
        quick_suggestions: [
          "Tagging files helps you find them faster during exams.",
          "Use the grid view to preview images quickly."
        ]
      };
    case 'preparation_room': 
       return {
        page: 'preparation_room',
        actions: [
          "Confirm your 3 pending uploads",
          "Check storage capacity",
          "Categorize the new Biology diagrams"
        ],
        quick_suggestions: [
          "Ensure PDFs are searchable before uploading.",
          "Smaller file sizes upload faster."
        ]
      };
    case 'timeline':
      return {
        page: 'timeline',
        actions: [
          "Replay the 'Calculus Basics' session",
          "Export last week's summary",
          "Mark 'Organic Chemistry' as high priority"
        ],
        quick_suggestions: [
          "Reviewing sessions within 24 hours improves retention.",
          "Filter by 'High Importance' to save time."
        ]
      };
    case 'study_plan':
      return {
        page: 'study_plan',
        actions: [
          "Set your target exam date",
          "Check off today's math goals",
          "Adjust your weekly load"
        ],
        quick_suggestions: [
          "Break big chapters into 30-minute chunks.",
          "Don't forget to schedule rest days."
        ]
      };
    case 'notifications':
      return {
        page: 'notifications',
        actions: [
          "Review 2 missed study reminders",
          "See what's new in v2.0 update",
          "Clear old alerts"
        ],
        quick_suggestions: [
          "Turn on sound for critical exam alerts only.",
          "Keep your inbox clean to avoid missing info."
        ]
      };
    case 'settings':
      return {
        page: 'settings',
        actions: [
          "Switch to Dark Mode for night study",
          "Change language to Hindi/Hinglish",
          "Adjust board zoom sensitivity"
        ],
        quick_suggestions: [
          "Dark mode reduces eye strain during late sessions.",
          "Ensure your profile info is up to date."
        ]
      };
    case 'profile':
      return {
        page: 'profile',
        actions: [
          "Update your display avatar",
          "Check your subscription status",
          "Analyze your monthly stats"
        ],
        quick_suggestions: [
          "Your completion rate is up 10% this week!",
          "Add your school details for better suggestions."
        ]
      };
    case 'help_support':
      return {
        page: 'help_support',
        actions: [
          "Read the FAQ on 'Upload Errors'",
          "Contact support regarding billing",
          "View app tour again"
        ],
        quick_suggestions: [
          "Check the troubleshooting guide before emailing support.",
          "Use the 'Feedback' form to suggest features."
        ]
      };
    default:
      return {
        page: 'unknown',
        actions: [],
        quick_suggestions: []
      };
  }
};

const getMockSmartNotes = (config: NoteGenerationConfig, fileName: string): GeneratedNoteContent => {
      let content = "";
      
      if (config.noteType === 'long_notes') {
        if (config.language === 'hinglish') {
          content = `
# Newton's Laws of Motion (Comprehensive Chapter Guide)

## 1. Introduction to Mechanics
Motion humare aas-paas har jagah hai. From planets revolving around the sun to a car moving on the road, everything follows specific rules. Physics mein **Mechanics** woh branch hai jo motion aur uske causes ko study karti hai. In rules ko Sir Isaac Newton ne 3 fundamental laws mein define kiya hai, jo aaj bhi classical physics ka base hain.

---

## 2. Newton's First Law (Law of Inertia)
**Statement:** "Koi bhi object tab tak rest ya uniform motion mein rahega jab tak uspar koi external unbalanced force apply na ho."

### Concept of Inertia
Inertia matlab 'zid'. Body apni state change nahi karna chahti.
*   **Inertia of Rest:** Agar body rest pe hai, toh rest pe hi rehna chahegi. (Example: Carpet ko stick se beat karne par dust nikalna).
*   **Inertia of Motion:** Agar body chal rahi hai, toh chalti hi rehna chahegi. (Example: Fan switch off karne ke baad bhi thodi der ghumta rehta hai).
*   **Inertia of Direction:** Body apni direction bina force ke change nahi karti. (Example: Gadi ke turn lene par passengers bahar ki taraf jhukte hain).

> **Exam Tip:** Inertia depends on Mass. **More mass = More inertia.** Hathi ko hilana mushkil hai, chuhe ko aasan.

---

## 3. Newton's Second Law (The Law of Force)
**Statement:** "The rate of change of momentum of a body is directly proportional to the applied force and takes place in the direction in which the force acts."

**Mathematical Derivation:**
$$ F \\propto \\frac{dp}{dt} $$
Jahan momentum $p = mv$.
$$ F = k \\frac{d(mv)}{dt} $$
Agar mass constant hai:
$$ F = m \\frac{dv}{dt} $$
$$ F = m \\times a $$

**Where:**
- **F** = Net External Force (Newtons)
- **m** = Mass of the body (kg)
- **a** = Acceleration produced (m/s²)

**Real-Life Application:**
Cricket player ball catch karte waqt apne haath peeche kheenchta hai. Kyun?
*   Taaki time ($\Delta t$) badh jaye.
*   Agar time badhega, toh Rate of Change of Momentum kam hoga.
*   Force on hands kam lagega aur chot nahi lagegi.

---

## 4. Newton's Third Law (Action and Reaction)
**Statement:** "To every action, there is always an equal and opposite reaction."

**Key Characteristics:**
1.  **Pairs:** Forces hamesha pairs mein exist karte hain. Single isolated force possible nahi hai.
2.  **Different Bodies:** Action aur Reaction hamesha **alag-alag bodies** par lagte hain. Isliye woh ek dusre ko cancel nahi karte (equilibrium mein nahi late).
3.  **Simultaneous:** Action aur reaction ek saath lagte hain. Koi time lag nahi hota.

**Examples:**
*   **Walking:** Hum zameen ko peeche push karte hain (Action), aur zameen humein aage push karti hai (Reaction/Friction).
*   **Rocket Propulsion:** Rocket gases ko neeche phenkta hai (Action), gases rocket ko upar lift karti hain (Reaction).
*   **Gun Recoil:** Bullet aage jati hai, gun peeche jerk karti hai.

---

## 5. Conservation of Linear Momentum
Agar system par net external force zero hai ($F_{ext} = 0$), toh total momentum constant rehta hai.
$$ p_i = p_f $$
$$ m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2 $$

**Applications:**
*   Collision problems.
*   Explosions (Bomb fatne par pieces alag directions mein jate hain taaki net momentum zero rahe).

---

## 6. Summary for Exam
*   **1st Law:** Defines Force & Inertia.
*   **2nd Law:** Gives formula/measurement of Force ($F=ma$).
*   **3rd Law:** Tells nature of Force (Action-Reaction).
`;
        } else {
          content = `
# Newton's Laws of Motion: Comprehensive Study Notes

## 1. Introduction to Classical Mechanics
Classical mechanics describes the motion of macroscopic objects, from projectiles to parts of machinery, and astronomical objects, such as spacecraft, planets, stars, and galaxies. The foundation of this field is laid by **Sir Isaac Newton's three laws of motion**, published in *Philosophiæ Naturalis Principia Mathematica* in 1687.

---

## 2. Newton's First Law: The Law of Inertia
**Statement:** An object at rest remains at rest, and an object in motion remains in motion at constant speed and in a straight line unless acted on by an unbalanced force.

### Understanding Inertia
Inertia is the inherent property of a body that resists any change in its state of rest or uniform motion.
*   **Mass as a Measure:** The mass of an object is a quantitative measure of its inertia.
    *   *Heavy Object:* High Inertia (Hard to start or stop).
    *   *Light Object:* Low Inertia (Easy to start or stop).

**Common Examples:**
1.  **Dust Removal:** Beating a carpet forces the fabric to move, but the dust particles tend to remain at rest due to inertia, thus separating from the carpet.
2.  **Car Braking:** When a car stops suddenly, passengers lurch forward because their lower body stops with the car, but their upper body continues to move forward due to inertia of motion.

---

## 3. Newton's Second Law: The Law of Acceleration
**Statement:** The acceleration of an object as produced by a net force is directly proportional to the magnitude of the net force, in the same direction as the net force, and inversely proportional to the mass of the object.

**Formula:**
$$ \vec{F}_{net} = m \vec{a} $$

**Derivation from Momentum:**
Momentum ($p$) is defined as the product of mass and velocity: $p = mv$.
Newton's second law states:
$$ F \propto \frac{dp}{dt} $$
$$ F = k \frac{d(mv)}{dt} $$
Assuming constant mass $m$ and constant of proportionality $k=1$:
$$ F = m \frac{dv}{dt} = ma $$

**Impulse:**
Impulse ($J$) is the change in momentum or force applied over a specific time.
$$ J = F \times \Delta t = \Delta p $$
*Application:* Shock absorbers in vehicles increase the time of impact ($\Delta t$), thereby reducing the force ($F$) felt by passengers during bumps.

---

## 4. Newton's Third Law: Action and Reaction
**Statement:** Whenever one object exerts a force on a second object, the second object exerts an equal and opposite force on the first.

**Crucial Points to Remember:**
*   **Forces come in pairs:** There is no such thing as an isolated force.
*   **Action and Reaction act on different objects:** This is why they do not cancel each other out to produce zero motion.
*   **Same nature:** If action is gravitational, reaction is gravitational. If action is contact force, reaction is contact force.

**Free Body Diagrams (FBD):**
To solve problems involving the 3rd law (like blocks connected by strings), always draw an FBD for each individual mass to visualize forces acting *on* that specific body.

---

## 5. Friction
Friction is a resistive force that opposes relative motion (or tendency of relative motion) between two surfaces in contact.

*   **Static Friction ($f_s$):** Opposes tendency of motion. Self-adjusting up to a limit ($f_{s,max} = \mu_s N$).
*   **Kinetic Friction ($f_k$):** Opposes actual motion. Constant value ($f_k = \mu_k N$).
*   Generally, $\mu_s > \mu_k$. It is harder to start moving an object than to keep it moving.

---

## 6. Circular Motion & Banking of Roads
For a vehicle taking a turn:
*   **Level Road:** Friction provides centripetal force. $$ v_{max} = \sqrt{\mu r g} $$
*   **Banked Road:** The normal force component assists in turning.
    $$ v_{optimum} = \sqrt{rg \tan\theta} $$ (No friction needed)
    This prevents wear and tear on tires.

`;
        }
      } else if (config.noteType === 'formula_sheet') {
          content = `
# Complete Physics Formula Sheet: Mechanics

## 1. Kinematics (Motion in 1D)
| Variable | Symbol | SI Unit |
| :--- | :---: | :---: |
| Displacement | $s$ | $m$ |
| Initial Velocity | $u$ | $m/s$ |
| Final Velocity | $v$ | $m/s$ |
| Acceleration | $a$ | $m/s^2$ |
| Time | $t$ | $s$ |

**Equations of Motion (Constant Acceleration):**
1. $$ v = u + at $$
2. $$ s = ut + \\frac{1}{2}at^2 $$
3. $$ v^2 = u^2 + 2as $$
4. Distance in $n^{th}$ second: $$ s_n = u + \frac{a}{2}(2n - 1) $$

---

## 2. Vectors & Projectile Motion
*   **Resultant Vector:** $$ R = \sqrt{A^2 + B^2 + 2AB\cos\theta} $$
*   **Direction:** $$ \tan\alpha = \frac{B\sin\theta}{A + B\cos\theta} $$
*   **Time of Flight:** $$ T = \frac{2u\sin\theta}{g} $$
*   **Max Height:** $$ H = \frac{u^2\sin^2\theta}{2g} $$
*   **Range:** $$ R = \frac{u^2\sin2\theta}{g} $$

---

## 3. Laws of Motion (Dynamics)
*   **Newton's 2nd Law:** $$ \vec{F}_{net} = m\vec{a} $$
*   **Momentum:** $$ \vec{p} = m\vec{v} $$
*   **Impulse:** $$ \vec{J} = \vec{F}_{avg} \Delta t = \Delta \vec{p} $$
*   **Friction:** $$ f_k = \mu_k N $$ (Kinetic)
*   **Limiting Friction:** $$ f_s \le \mu_s N $$
*   **Centripetal Force:** $$ F_c = \frac{mv^2}{r} = m\omega^2r $$

---

## 4. Work, Energy & Power
*   **Work Done:** $$ W = \vec{F} \cdot \vec{s} = Fs\cos\theta $$
*   **Kinetic Energy:** $$ K = \frac{1}{2}mv^2 = \frac{p^2}{2m} $$
*   **Potential Energy (Gravitational):** $$ U = mgh $$
*   **Spring Potential Energy:** $$ U = \frac{1}{2}kx^2 $$
*   **Power:** $$ P = \frac{dW}{dt} = \vec{F} \cdot \vec{v} $$
*   **Work-Energy Theorem:** $$ W_{net} = \Delta K = K_f - K_i $$

**Exam Tip:** ★★★★☆
Always identify the system and external forces before applying Conservation of Linear Momentum.
          `;
      } else if (config.noteType === 'short_notes') {
          content = `
# Quick Revision: Newton's Laws & Mechanics

## key Concepts
*   **Inertia:** Resistance to change. Dependent on Mass ($m$).
*   **Force ($F$):** Push or pull. Defined by $F=ma$.
*   **Momentum ($p$):** Quantity of motion. $p=mv$. Conserved in isolated systems.

## The 3 Laws
1.  **Law 1 (Inertia):** Object stays as is unless external force acts.
    *   *Ex:* Passenger falls back when bus starts.
2.  **Law 2 (Force):** $F = \frac{dp}{dt} = ma$.
    *   *Ex:* Catching ball with soft hands reduces force.
3.  **Law 3 (Action-Reaction):** Forces occur in pairs. $F_{AB} = -F_{BA}$.
    *   *Ex:* Recoil of gun, walking, swimming.

## Friction & Circular Motion
*   **Static ($f_s$):** Self-adjusting. Prevents motion. Max value $\mu_s N$.
*   **Kinetic ($f_k$):** Opposes motion. Constant value $\mu_k N$.
*   **Banking:** Angle $\tan\theta = v^2/rg$ for safe turn without friction.

## Work & Energy
*   **Work:** $W = Fd\cos\theta$. Zero if force $\perp$ displacement.
*   **Conservative Force:** Work depends only on end points (Gravity, Electrostatic).
*   **Power:** Rate of doing work. $P = Fv$.
          `;
      } else {
          content = "Content generated for " + config.noteType;
      }

      return {
        title: fileName.replace(/\.[^/.]+$/, "") + " - " + (config.noteType === 'long_notes' ? "Study Notes" : "Summary"),
        type: config.noteType,
        content: content,
        tags: ['Physics', 'Mechanics', 'Important', 'JEE/NEET'],
        citations: ['Page 12, Para 2', 'Page 14, Figure 1.1', 'NCERT Physics Vol 1']
      };
};

export const getDashboardGuidance = async (page: PageName): Promise<AIResponse> => {
  try {
    const prompt = `You are a helpful student tutor assistant AI.
    The user is currently on the "${page}" page of their study dashboard.
    Provide 3 specific, actionable items they should do next, and 2 quick motivational or helpful suggestions.
    The context is a student preparing for exams like JEE/NEET.
    
    Return the response in JSON format.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);

    const text = result.response.text();
    if (text) {
      const data = JSON.parse(text) as AIResponse;
      // Ensure the page property matches
      return { ...data, page };
    }
  } catch (error) {
    console.warn("Gemini API call failed, falling back to mock data:", error);
  }
  return getMockDashboardGuidance(page);
};

export const generateSmartNotes = async (config: NoteGenerationConfig, fileName: string): Promise<GeneratedNoteContent> => {
  try {
    const prompt = `Generate VERY DETAILED and COMPREHENSIVE study notes for a document named "${fileName}".
    The output should be extensive, covering multiple sections, concepts, examples, and derivations if applicable.
    Imagine you are generating a complete chapter summary or a full set of revision notes, not just a brief.
    
    Configuration:
    - Note Type: ${config.noteType} (If 'long_notes', make it very detailed with at least 5-6 major sections, examples, and summary)
    - Language: ${config.language}
    - Depth: ${config.depth} (If 'deep', go into mathematical derivations and advanced concepts)
    
    Content Requirements:
    - Use Markdown formatting (headers, bold, lists, LaTeX math blocks $$...$$).
    - Include a title, the content, relevant tags, and simulated citations/sources.
    - For Hinglish, use a natural conversational mix of Hindi and English suitable for Indian students.
    - Ensure the content is accurate, educational, and easy to read.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent(prompt);

    const text = result.response.text();
    if (text) {
      return JSON.parse(text) as GeneratedNoteContent;
    }
  } catch (error) {
    console.warn("Gemini API call failed, falling back to mock data:", error);
  }
  return getMockSmartNotes(config, fileName);
};