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
    "title": "Real-world lettering references",
    "seconds": 35,
    "name": "Learning objectives",
    "notes": [
      "These four photographs show real lettering. The YANK tag emphasizes signature rhythm. SPLEEN uses inflated, rounded contours. The large 1UP uses broad fills and straight edges. The German Wildstyle piece combines letter bodies with overlaps and extensions. Below, the studies show those construction ideas in whole words, rather than four versions of an S. They illustrate structure, not the artists’ recorded stroke order. Bubble S remains our semester lesson. The other styles show possible curriculum directions, with Wildstyle reserved for a future showcase."
    ],
    "refs": [
      "handstyleRef",
      "bubbleRef",
      "blockRef",
      "wildstyleRef"
    ]
  },
  {
    "title": "A quiet space to practice",
    "seconds": 20,
    "name": "Learning environment",
    "notes": [
      "Players practice inside a quiet virtual concrete studio. The reference is Tadao Ando’s Langen Foundation: exposed concrete, natural light and a restrained interior. Our proposed layout places a guided practice wall beside a tool station, with a separate wall for free creation. The photograph is an architectural reference, not the proposed room layout."
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
      "The guidance separates three layers: a target mark on the wall, a motion trail in front of it, and the hand and tool pose. Observational learning informs the demonstration of stroke order and timing. Scaffolding informs the move from full support to a faint trail and finally no overlay. Feedback distinguishes how the movement was performed from the resulting painted path. Yu and colleagues’ XR guidance framework also distinguishes advance movement cues from corrective feedback. VR is useful because these cues occupy the same space as the tracked hand and wall. We still need an unguided test: success while following an overlay is not enough to establish learning."
    ],
    "refs": [
      "han",
      "wulf",
      "yu",
      "levac"
    ]
  },
  {
    "title": "A pilot with an unguided test",
    "seconds": 45,
    "name": "Evaluation plan",
    "notes": [
      "The optional pilot compares a conventional visual demonstration and target with ghost hand, tool and spatial trail. We would randomly assign beginners to a condition, keep practice duration equal, and use unguided pretests and posttests. For painted trajectory error, we anchor both paths to the same wall coordinates, resample the learner centerline at equal arc-length intervals, and average distance to the target curve. Separately, we log variation in can-to-wall distance while spraying. We compare change in those metrics, not an invented accuracy score. A small pilot would establish feasibility, not physical transfer."
    ],
    "refs": [
      "levac"
    ]
  },
  {
    "title": "The recording becomes material",
    "seconds": 40,
    "name": "Creative extension",
    "notes": [
      "The same recording could also become creative material. Temporal Layers keeps earlier attempts as translucent parts of a composition. Instead of erasing every previous version, the artist makes that history visible. Time-to-Space maps elapsed stroke time to depth: early and late parts of a flat mark occupy different positions away from the wall. The perspective change shows the resulting spatial line. Both are concept animations and stretch directions. The semester commitment remains the lettering lesson, while the creative vision grows from data that lesson already needs."
    ],
    "refs": []
  },
  {
    "title": "A shared stroke system",
    "seconds": 50,
    "name": "Implementation and feasibility",
    "notes": [
      "The technical plan uses a Meta Quest headset with tracked controllers, Unity and C#, OpenXR, and the XR Interaction Toolkit. Tool input feeds a shared stroke engine. For the first planar wall, ray hits map to UV coordinates and brush stamps accumulate in a bounded RenderTexture. A recorder stores timestamped pose, tool settings and stroke data in wall coordinates. That supports ghost replay, lesson state and local metrics. The main risks are rendering cost and replay alignment. We would profile early on Quest, cap history, lower texture resolution if necessary, and calibrate wall height and reach. If scope slips, we simplify contact tools and protect the complete spray lesson."
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
      "I’m developing this project solo, drawing on experience with Unity XR, interactive systems, visual design and media production. I own the design, code, creative direction, instrumentation and evaluation planning. The roadmap has four gates: a working spray wall, basic tools and the S target, recorded guidance with fading, and an independent attempt with logging and polish. Dates will follow the course deadline. The protected deliverable is one complete lesson. A participant pilot and temporal art interactions follow only if that core is stable. I’d welcome feedback on the guidance and the scope."
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
