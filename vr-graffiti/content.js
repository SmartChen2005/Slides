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
    "title": "The hidden movement",
    "seconds": 40,
    "name": "Problem and evidence",
    "notes": [
      "The target users are beginners interested in graffiti and lettering, especially people without a suitable practice space. Physical practice uses consumable materials and requires appropriate ventilation. But the teaching problem is also movement: the finished S does not reveal tool distance, angle, pace or stroke order. Han and colleagues reviewed eighteen studies in physical education and found support for observational motor learning. That gives us a reason to test demonstration here, while leaving the graffiti-specific learning benefit as an open question."
    ],
    "refs": [
      "han",
      "krylon"
    ]
  },
  {
    "title": "Existing tools and the learning gap",
    "seconds": 35,
    "name": "Existing solutions",
    "notes": [
      "There are strong existing tools. Kingspray’s official PC listing already describes spray simulation, replay, reference projection and interactive tutorials. Open Brush already supports painting in three-dimensional space. So neither replay nor spatial painting is the novelty claim. This project focuses on connecting expert motion, guided imitation, feedback and an independent attempt within one lettering lesson. The creative extension then reuses the same recording. We would evaluate that combination rather than assume it is better."
    ],
    "refs": [
      "king",
      "brush"
    ]
  },
  {
    "title": "Learn different lettering styles",
    "seconds": 35,
    "name": "Learning objectives",
    "notes": [
      "The curriculum explores different graffiti lettering styles. Handstyle develops signature rhythm. Bubble lettering uses inflated, rounded contours. Wildstyle combines letter bodies, overlaps and extensions. The photographs show how these styles appear on actual walls, while the animations break down their construction. Bubble S remains the semester lesson; Handstyle is a possible next lesson, and Wildstyle is a future direction."
    ],
    "refs": [
      "handstyleRef",
      "bubbleRef",
      "wildstyleRef"
    ]
  },
  {
    "title": "A quiet space to practice",
    "seconds": 20,
    "name": "Learning environment",
    "notes": [
      "Players begin in a quiet virtual concrete studio. The reference is Tadao Ando’s Langen Foundation: exposed concrete, natural light and a restrained interior. A guided practice wall and nearby tools provide a starting point. The creative playground lets players build their own arrangement of painting surfaces. The photograph references the material and light of the space."
    ],
    "refs": [
      "spacePhoto"
    ]
  },
  {
    "title": "One studio, three ways to paint",
    "seconds": 35,
    "name": "Studio and tools",
    "notes": [
      "The studio keeps the tool station beside the learning wall and a free creation wall. Spray is the main tool: the trigger controls paint, and distance changes its footprint. The marker uses tip contact and orientation for a crisp mark. The roller uses a broad contact region for fills. All three share the same paint infrastructure. These are approximations: Quest controllers do not reproduce real tip pressure, friction, aerosol resistance or the weight of each tool."
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
    "title": "A shared stroke system",
    "seconds": 50,
    "name": "Implementation and feasibility",
    "notes": [
      "The technical plan uses Meta Quest controllers, Unity and C#, OpenXR, and the XR Interaction Toolkit. A placement mode creates, moves and rotates simple wall surfaces. Each surface has an ID and a transform. Painting maps ray hits to its local UV coordinates and stores strokes relative to that surface, so the paint moves with the wall. A shared recorder supports ghost replay, lesson state and local metrics. The main risks are rendering cost and replay alignment. We would profile early, cap paint history and calibrate the learning wall. Free-space strokes would use spatial curves as a creative extension. If scope slips, protect the spray lesson and basic wall placement."
    ],
    "refs": [
      "unity"
    ]
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
  }
];
