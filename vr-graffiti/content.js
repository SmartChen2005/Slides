"use strict";

window.GRAFFITI_CONTENT = [
  {
    "title": "VR Graffiti",
    "seconds": 20,
    "name": "The concept",
    "notes": [
      "I’m proposing VR Graffiti, a virtual studio where beginners learn the motion behind lettering. It records how a mark is made, uses that motion for guided practice, and later turns recorded gestures into art across space and time. These animations illustrate the concept."
    ],
    "refs": []
  },
  {
    "title": "Why Learn Graffiti in VR?",
    "seconds": 40,
    "name": "Physical skill",
    "notes": [
      "Why learn graffiti in VR? Graffiti is a physical skill, not just a visual art. Learning graffiti requires coordination between movement, distance and speed, and lettering. Movement means controlling hand trajectories and smooth strokes. Distance and speed shape spray width, opacity and consistency. Lettering brings in letter structure, proportions and styles. These demands motivate a virtual environment where beginners can practice the gesture as well as the mark."
    ],
    "refs": [
      "krylon"
    ]
  },
  {
    "title": "The problem and the opportunity",
    "seconds": 35,
    "name": "Practice barriers and VR opportunity",
    "notes": [
      "The problem: Beginners face barriers to practicing consistently, including limited access to appropriate spaces, material costs, and safety considerations. The opportunity: VR can provide an accessible, repeatable environment for learning and experimenting with graffiti techniques. The photographs illustrate a wall, consumable spray paint and protective equipment."
    ],
    "refs": [
      "practiceWall",
      "practiceCans",
      "practiceMask"
    ]
  },
  {
    "title": "Structured, repeatable practice with feedback",
    "seconds": 35,
    "name": "The learning gap",
    "notes": [
      "Graffiti combines artistic expression with embodied motor skills, but beginners rarely have access to structured, repeatable practice with feedback."
    ],
    "refs": []
  },
  {
    "title": "Existing Solutions & The Gap",
    "seconds": 20,
    "name": "Existing solutions and the gap",
    "notes": [
      "Kingspray Graffiti VR offers realistic spray physics, multiple caps, multiplayer painting, and reference projection. Its official description presents tutorials that take users through application features. Our project analysis identifies a gap in graffiti techniques and artistic fundamentals for complete beginners. Vermillion VR provides realistic oil painting, guided tutorials, reference tracing, and color mixing. It focuses on traditional painting rather than graffiti-specific techniques and lettering. Our opportunity is a beginner-oriented VR learning environment with structured instruction, progressive skill development, and measurable feedback."
    ],
    "refs": [
      "king",
      "vermillion"
    ]
  },
  {
    "title": "From Simulation to Skill Learning",
    "seconds": 35,
    "name": "Learning theory",
    "notes": [
      "Observe, Trace, Reproduce, Remix. Our learning experience draws on three educational theories. Observational Learning: Observe and imitate an expert's hand movements through an animated virtual hand. Scaffolding: Gradually remove visual guides and assistance as learners gain proficiency. Constructionism: Develop understanding by creating personalized graffiti and experimenting with different styles. From imitation to independent creation."
    ],
    "refs": []
  },
  {
    "title": "Learning the Tools",
    "seconds": 30,
    "name": "Learning the Tools",
    "notes": [
      "Spray can, marker and roller behave differently. The spray lesson develops distance, speed and coverage. A marker develops controlled lines, sketching and precise outlines. A roller develops broad strokes, large fills and surface coverage. The three moving demonstrations are illustrative virtual tools."
    ],
    "refs": []
  },
  {
    "title": "Practicing Stroke Techniques",
    "seconds": 40,
    "name": "Practicing Stroke Techniques",
    "notes": [
      "The ghost hand first demonstrates the ideal movement. The learner follows the visible trajectory while controlling spray distance and speed. Full guidance includes both the expert hand and the path. Partial guidance reduces the assistance. Independent practice removes it. Straight lines and curves, outlines and fills, and stroke width and consistency provide the basic practice vocabulary."
    ],
    "refs": []
  },
  {
    "title": "Learning Lettering Styles",
    "seconds": 35,
    "name": "Learning Lettering Styles",
    "notes": [
      "The supplied alphabet chart stays intact. Learners select individual letters to inspect their structure and proportions. The enlarged view is a detail from the same original image. The learning sequence is Observe, Trace, Reproduce, progressing toward words and tags. The chart does not establish an artist’s actual stroke order. Future lessons can demonstrate order and direction using recorded expert movement."
    ],
    "refs": []
  },
  {
    "title": "Creative Expression",
    "seconds": 30,
    "name": "Creative Expression",
    "notes": [
      "Learners combine tools, strokes and lettering in an original tag. The original FLOW composition develops from an outline into fills, contours and personal stylistic details. This stage applies constructionism: understanding develops through creating a personally meaningful artifact. The composition illustrates the intended creative freedom."
    ],
    "refs": []
  },
  {
    "title": "Technical Implementation Plan",
    "seconds": 50,
    "name": "Technical implementation",
    "notes": [
      "Hardware and software: Meta Quest 3S, Unity, C#, and XR Interaction Toolkit. The core implementation tracks hand position, angle, speed, and distance from the wall. Spray behavior responds to movement. Recorded expert movements support replay and guided practice. This is the proposed implementation plan."
    ],
    "refs": []
  },
  {
    "title": "A first lesson: Bubble S",
    "seconds": 55,
    "name": "Learning journey",
    "notes": [
      "Imagine a beginner entering the studio and choosing Bubble S. First, Observe plays the recorded hand and tool motion, including its distance from the wall. During Trace, the learner follows a spatial trail while painting. A quiet distance cue helps them adjust without a stream of distracting alerts. The guide then fades. In Reproduce, the learner paints the letter independently and reviews the attempt afterward. They can request the demonstration again if needed. Finally, Remix invites a different proportion, color or tool. At that point, copying the target is no longer the objective. The animation shows that progression, including a learner cursor that follows rather than simply watching the letter draw itself."
    ],
    "refs": []
  },
  {
    "title": "What the guidance teaches",
    "seconds": 55,
    "name": "Learning science",
    "notes": [
      "The guidance separates three layers: a target mark on the wall, a motion trail in front of it, and the hand and tool pose. Observational learning informs the demonstration of stroke order and timing. Scaffolding informs the move from full support to a faint trail and finally no overlay. Feedback distinguishes how the movement was performed from the resulting painted path. Yu and colleagues’ XR guidance framework also distinguishes advance movement cues from corrective feedback. VR is useful because these cues occupy the same space as the tracked hand and wall. The independent attempt lets learners practice without an overlay before entering the creative playground."
    ],
    "refs": [
      "han",
      "wulf",
      "yu",
      "levac"
    ]
  },
  {
    "title": "Free Space to Practice",
    "seconds": 45,
    "name": "Creative playground",
    "notes": [
      "Players can build their own practice environment. They create walls of different sizes, move and rotate them, and arrange a layout around the artwork they want to make. The animation first adds surfaces, then rearranges them into a personal studio. Finally, a gesture continues off a wall into open space. That is the broader creative direction: users decide both what to paint and where painting can happen. Editable walls are part of the core playground; free-space strokes extend it toward spatial artwork. They can return to a lesson whenever they want guidance."
    ],
    "refs": []
  },
  {
    "title": "Beyond Traditional 3D Art",
    "seconds": 40,
    "name": "Creative extension",
    "notes": [
      "The playground leads into a further creative direction: using the history of making as part of the artwork. Temporal Layers lets earlier gestures remain visible as translucent layers in a composition. Time-to-Space maps elapsed stroke time to depth, so different moments of a gesture occupy different positions away from the wall. These ideas add time and process to the painted form. They are proposed creative extensions built on existing spatial painting and replay. The semester core remains guided lettering and free creation; these experiments reuse the same recorded strokes."
    ],
    "refs": []
  },
  {
    "title": "A semester-sized commitment",
    "seconds": 40,
    "name": "Ownership and roadmap",
    "notes": [
      "I’m developing this project solo, drawing on experience with Unity XR, interactive systems, visual design and media production. I own the design, code, creative direction, instrumentation and evaluation planning. The roadmap has four gates: a working spray wall with basic surface placement, basic tools and the S target, recorded guidance with fading, and an independent attempt with logging and polish. Dates will follow the course deadline. The protected deliverable is one complete lesson. Spatial painting, a participant pilot and temporal art interactions follow only if that core is stable. I’d welcome feedback on the guidance and the scope."
    ],
    "refs": []
  },
  {
    "title": "References",
    "seconds": 0,
    "name": "References",
    "notes": [
      "Use the linked original papers and official product pages for questions about evidence. Han’s review concerns physical education, not graffiti. Levac’s review discusses learning and transfer limits across virtual environments. Yu’s paper provides a design space for XR movement cues and feedback. Wulf’s review informs observation and feedback choices. None validates the proposed application. Product comparisons describe documented capabilities rather than an exhaustive feature audit."
    ],
    "refs": [
      "han",
      "levac",
      "yu",
      "wulf",
      "king",
      "brush",
      "krylon",
      "unity"
    ],
    "backup": true,
    "html": "<h2>References</h2><p class=\"lead\" style=\"font-size:21px\">Research informs the design; outcomes remain untested.</p><div class=\"reference-grid\">\n      <div class=\"reference\"><h3><a href=\"https://doi.org/10.3390/ijerph191610109\" target=\"_blank\" rel=\"noopener noreferrer\">Han, Y., Ali, S. K. B. S., & Ji, L. (2022)</a></h3><p>Use of Observational Learning to Promote Motor Skill Learning in Physical Education: A Systematic Review.<br><i>IJERPH, 19</i>(16), 10109. 18 included studies.</p></div>\n      <div class=\"reference\"><h3><a href=\"https://doi.org/10.1186/s12984-019-0587-8\" target=\"_blank\" rel=\"noopener noreferrer\">Levac, D. E., Huber, M. E., & Sternad, D. (2019)</a></h3><p>Learning and transfer of complex motor skills in virtual reality: a perspective review.<br><i>Journal of NeuroEngineering and Rehabilitation, 16</i>, 121.</p></div>\n      <div class=\"reference\"><h3><a href=\"https://doi.org/10.1145/3613904.3642143\" target=\"_blank\" rel=\"noopener noreferrer\">Yu, X., Lee, B., & Sedlmair, M. (2024)</a></h3><p>Design Space of Visual Feedforward And Corrective Feedback in XR-Based Motion Guidance Systems.<br><i>CHI 2024</i>. </p></div>\n      <div class=\"reference\"><h3><a href=\"https://doi.org/10.1111/j.1365-2923.2009.03421.x\" target=\"_blank\" rel=\"noopener noreferrer\">Wulf, G., Shea, C., & Lewthwaite, R. (2010)</a></h3><p>Motor skill learning and performance: a review of influential factors.<br><i>Medical Education, 44</i>(1), 75–84.</p></div>\n      <div class=\"reference\"><h3><a href=\"https://store.steampowered.com/app/471660/Kingspray_Graffiti_VR/\" target=\"_blank\" rel=\"noopener noreferrer\">Infectious Ape. Kingspray Graffiti VR</a></h3><p>Official PC listing: spray, replay, projection and tutorials.<br>Features vary by platform.</p></div>\n      <div class=\"reference\"><h3><a href=\"https://openbrush.app/\" target=\"_blank\" rel=\"noopener noreferrer\">Open Brush</a></h3><p>Official project site. Room-scale 3D painting.</p></div>\n      <div class=\"reference\"><h3><a href=\"https://www.krylon.com/en/how-to/how-to-spray-paint\" target=\"_blank\" rel=\"noopener noreferrer\">Krylon. How to Spray Paint</a></h3><p>Manufacturer guidance: technique and ventilation.</p></div>\n      <div class=\"reference\"><h3><a href=\"https://docs.unity.com/en-us/engine/6000.0/manual/xr/configuring-project-for/scene-setup/input-overview\" target=\"_blank\" rel=\"noopener noreferrer\">Unity. XR input options</a></h3><p>Official Unity 6 documentation.<br>OpenXR, controller tracking and XR Interaction Toolkit.</p></div></div><p class=\"cite\">Original sources linked. Product documentation checked October 27, 2026. Q&A backup.</p>"
  },
  {
    "title": "Discussion",
    "seconds": 0,
    "name": "Q&A",
    "notes": [
      "The most useful feedback concerns whether beginners can read the layered cues, which metric captures the intended skill, and whether the solo scope is credible. If asked about novelty, acknowledge existing spray simulation, replay and 3D painting. The contribution is the proposed learning sequence and how its recordings support a later creative interaction. If asked about the pilot, prioritize a stable lesson and verified logging before recruitment. For future implementation, resample the ink centerline at 100 equal arc-length positions in wall coordinates and compute mean nearest-target distance. Log tool distance at a fixed interval while the trigger is active. Report each metric separately, including pre/post change and individual patterns, with no underpowered superiority claim."
    ],
    "refs": [],
    "backup": true,
    "html": "<h2>Discussion</h2><p class=\"lead\">Questions for the next iteration</p><div class=\"qa-grid\"><div><h3>Why VR instead of a video?</h3><p>Show tool motion at the wall.<br>Practice in the same space.</p></div><div><h3>Will this transfer to real paint?</h3><p>Unknown: controllers lack material feedback.<br>Physical transfer needs a separate test.</p></div><div><h3>Why keep three tools?</h3><p>Shared paint and recording systems.<br>Spray first; basic contact tools.</p></div><div><h3>What if the plan is too large?</h3><p>Protect the spray lesson and logging.<br>Defer the pilot and temporal art.</p></div><div><h3>How will remix be assessed?</h3><p>Reflection or artist feedback.<br>Path error measures copying.</p></div><div><h3>What is the first thing to validate?</h3><p>Can beginners follow the cues<br>while seeing their own mark?</p></div></div><p class=\"cite\">Q&A backup. Physical transfer and comparative learning benefits remain untested.</p>"
  },
  {
    "title": "One studio, three ways to paint",
    "seconds": 0,
    "name": "Studio and tools",
    "notes": [
      "The studio keeps the tool station beside the learning wall and a free creation wall. Spray is the main tool: the trigger controls paint, and distance changes its footprint. The marker uses tip contact and orientation for a crisp mark. The roller uses a broad contact region for fills. All three share the same paint infrastructure. These are approximations: Quest controllers do not reproduce real tip pressure, friction, aerosol resistance or the weight of each tool."
    ],
    "refs": [],
    "backup": true
  }
];
