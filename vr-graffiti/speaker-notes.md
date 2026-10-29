# VR Graffiti: presenter script

16 main slides, 10:05 planned talk. Three backup slides support 3–5 minutes of Q&A.

Open index.html or the self-contained HTML in a browser. Arrow keys navigate. N opens these notes, R replays, Space pauses and F opens fullscreen. End opens the last main slide.

## 1. VR Graffiti

I’m proposing VR Graffiti, a virtual studio where beginners learn the motion behind lettering. It records how a mark is made, uses that motion for guided practice, and later turns recorded gestures into art across space and time. These animations illustrate the concept.

## 2. Why Learn Graffiti in VR?

Why learn graffiti in VR? Graffiti is a physical skill, not just a visual art. Learning graffiti requires coordination between movement, distance and speed, and lettering. Movement means controlling hand trajectories and smooth strokes. Distance and speed shape spray width, opacity and consistency. Lettering brings in letter structure, proportions and styles. These demands motivate a virtual environment where beginners can practice the gesture as well as the mark.

[Krylon, How to Spray Paint](https://www.krylon.com/en/how-to/how-to-spray-paint)

## 3. The problem and the opportunity

The problem: Beginners face barriers to practicing consistently, including limited access to appropriate spaces, material costs, and safety considerations. The opportunity: VR can provide an accessible, repeatable environment for learning and experimenting with graffiti techniques. The photographs illustrate a wall, consumable spray paint and protective equipment.

[Wall: Singlespeedfahrer](https://commons.wikimedia.org/wiki/File:Graffiti_Mauerpark_Berlin.jpg). [Cans: Chris Barbalis](https://commons.wikimedia.org/wiki/File:Spray_cans_in_front_of_graffiti_(Unsplash).jpg). [Mask: Haragayato](https://commons.wikimedia.org/wiki/File:HEPA_half-face_respirator.jpg)

## 4. Structured, repeatable practice with feedback

Graffiti combines artistic expression with embodied motor skills, but beginners rarely have access to structured, repeatable practice with feedback.

## 5. Existing Solutions & The Gap

Kingspray Graffiti VR offers realistic spray physics, multiple caps, multiplayer painting, and reference projection. Its official description presents tutorials that take users through application features. Our project analysis identifies a gap in graffiti techniques and artistic fundamentals for complete beginners. Vermillion VR provides realistic oil painting, guided tutorials, reference tracing, and color mixing. It focuses on traditional painting rather than graffiti-specific techniques and lettering. Our opportunity is a beginner-oriented VR learning environment with structured instruction, progressive skill development, and measurable feedback.

[Kingspray, official PC description](https://store.steampowered.com/app/471660/Kingspray_Graffiti_VR/). [Vermillion, official website](https://vermillion-vr.com/)

## 6. From Simulation to Skill Learning

Observe, Trace, Reproduce, Remix. Our learning experience draws on three educational theories. Observational Learning: Observe and imitate an expert's hand movements through an animated virtual hand. Scaffolding: Gradually remove visual guides and assistance as learners gain proficiency. Constructionism: Develop understanding by creating personalized graffiti and experimenting with different styles. From imitation to independent creation.

## 7. Learning the Tools

Spray can, marker and roller behave differently. The spray lesson develops distance, speed and coverage. A marker develops controlled lines, sketching and precise outlines. A roller develops broad strokes, large fills and surface coverage. The three moving demonstrations are illustrative virtual tools.

## 8. Practicing Stroke Techniques

The ghost hand first demonstrates the ideal movement. The learner follows the visible trajectory while controlling spray distance and speed. Full guidance includes both the expert hand and the path. Partial guidance reduces the assistance. Independent practice removes it. Straight lines and curves, outlines and fills, and stroke width and consistency provide the basic practice vocabulary.

## 9. Learning Lettering Styles

The supplied alphabet chart stays intact. Learners select individual letters to inspect their structure and proportions. The enlarged view is a detail from the same original image. The learning sequence is Observe, Trace, Reproduce, progressing toward words and tags. The chart does not establish an artist’s actual stroke order. Future lessons can demonstrate order and direction using recorded expert movement.

## 10. Creative Expression

Learners combine tools, strokes and lettering in an original tag. The original FLOW composition develops from an outline into fills, contours and personal stylistic details. This stage applies constructionism: understanding develops through creating a personally meaningful artifact. The composition illustrates the intended creative freedom.

## 11. Technical Implementation Plan

Hardware and software: Meta Quest 3S, Unity, C#, and XR Interaction Toolkit. The core implementation tracks hand position, angle, speed, and distance from the wall. Spray behavior responds to movement. Recorded expert movements support replay and guided practice. This is the proposed implementation plan.

## 12. A first lesson: Bubble S

Imagine a beginner entering the studio and choosing Bubble S. First, Observe plays the recorded hand and tool motion, including its distance from the wall. During Trace, the learner follows a spatial trail while painting. A quiet distance cue helps them adjust without a stream of distracting alerts. The guide then fades. In Reproduce, the learner paints the letter independently and reviews the attempt afterward. They can request the demonstration again if needed. Finally, Remix invites a different proportion, color or tool. At that point, copying the target is no longer the objective. The animation shows that progression, including a learner cursor that follows rather than simply watching the letter draw itself.

## 13. Guidance that steps back

The guidance separates three layers: a target mark on the wall, a motion trail in front of it, and the hand and tool pose. Observational learning informs the demonstration of stroke order and timing. Scaffolding informs the move from full support to a faint trail and finally no overlay. Feedback distinguishes how the movement was performed from the resulting painted path. Yu and colleagues’ XR guidance framework also distinguishes advance movement cues from corrective feedback. VR is useful because these cues occupy the same space as the tracked hand and wall. The independent attempt lets learners practice without an overlay before entering the creative playground.

[Han et al., 2022](https://doi.org/10.3390/ijerph191610109). [Wulf et al., 2010](https://doi.org/10.1111/j.1365-2923.2009.03421.x). [Yu et al., CHI 2024](https://doi.org/10.1145/3613904.3642143). [Levac et al., 2019](https://doi.org/10.1186/s12984-019-0587-8)

## 14. Free Space to Practice

Players can build their own practice environment. They create walls of different sizes, move and rotate them, and arrange a layout around the artwork they want to make. The animation first adds surfaces, then rearranges them into a personal studio. Finally, a gesture continues off a wall into open space. That is the broader creative direction: users decide both what to paint and where painting can happen. Editable walls are part of the core playground; free-space strokes extend it toward spatial artwork. They can return to a lesson whenever they want guidance.

## 15. Beyond Traditional 3D Art

The playground leads into a further creative direction: using the history of making as part of the artwork. Temporal Layers lets earlier gestures remain visible as translucent layers in a composition. Time-to-Space maps elapsed stroke time to depth, so different moments of a gesture occupy different positions away from the wall. These ideas add time and process to the painted form. They are proposed creative extensions built on existing spatial painting and replay. The semester core remains guided lettering and free creation; these experiments reuse the same recorded strokes.

## 16. One complete lesson

I’m developing this project solo, drawing on experience with Unity XR, interactive systems, visual design and media production. I own the design, code, creative direction, instrumentation and evaluation planning. The roadmap has four gates: a working spray wall with basic surface placement, basic tools and the S target, recorded guidance with fading, and an independent attempt with logging and polish. Dates will follow the course deadline. The protected deliverable is one complete lesson. Spatial painting, a participant pilot and temporal art interactions follow only if that core is stable. I’d welcome feedback on the guidance and the scope.

## 17. References (Backup)

Use the linked original papers and official product pages for questions about evidence. Han’s review concerns physical education, not graffiti. Levac’s review discusses learning and transfer limits across virtual environments. Yu’s paper provides a design space for XR movement cues and feedback. Wulf’s review informs observation and feedback choices. None validates the proposed application. Product comparisons describe documented capabilities rather than an exhaustive feature audit.

[Han et al., 2022](https://doi.org/10.3390/ijerph191610109). [Levac et al., 2019](https://doi.org/10.1186/s12984-019-0587-8). [Yu et al., CHI 2024](https://doi.org/10.1145/3613904.3642143). [Wulf et al., 2010](https://doi.org/10.1111/j.1365-2923.2009.03421.x). [Kingspray, official PC description](https://store.steampowered.com/app/471660/Kingspray_Graffiti_VR/). [Open Brush](https://openbrush.app/). [Krylon, How to Spray Paint](https://www.krylon.com/en/how-to/how-to-spray-paint). [Unity, XR input options](https://docs.unity.com/en-us/engine/6000.0/manual/xr/configuring-project-for/scene-setup/input-overview)

## 18. Discussion (Backup)

The most useful feedback concerns whether beginners can read the layered cues, which metric captures the intended skill, and whether the solo scope is credible. If asked about novelty, acknowledge existing spray simulation, replay and 3D painting. The contribution is the proposed learning sequence and how its recordings support a later creative interaction. If asked about the pilot, prioritize a stable lesson and verified logging before recruitment. For future implementation, resample the ink centerline at 100 equal arc-length positions in wall coordinates and compute mean nearest-target distance. Log tool distance at a fixed interval while the trigger is active. Report each metric separately, including pre/post change and individual patterns, with no underpowered superiority claim.

## 19. Three tools, different control (Backup)

The studio keeps the tool station beside the learning wall and a free creation wall. Spray is the main tool: the trigger controls paint, and distance changes its footprint. The marker uses tip contact and orientation for a crisp mark. The roller uses a broad contact region for fills. All three share the same paint infrastructure. These are approximations: Quest controllers do not reproduce real tip pressure, friction, aerosol resistance or the weight of each tool.

[Montana Cans product photography](https://www.montana-cans.com/Montana-BLACK-400ml/272073). [MTN / Spray Planet product photography](https://www.sprayplanet.com/products/mtn-street-paint-markers-15mm-orange). [Purdy product photography](https://www.purdy.co.uk/products/rollers/mini-roller-system/)

