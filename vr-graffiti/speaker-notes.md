# VR Graffiti: presenter script

12 main slides, 7:50 planned talk. Two backup slides support 3–5 minutes of Q&A.

Open index.html or the self-contained HTML in a browser. Arrow keys navigate. N opens these notes, R replays, Space pauses and F opens fullscreen. End opens the last main slide.

## 1. VR Graffiti

I’m proposing VR Graffiti, a virtual studio where beginners learn the motion behind lettering. It records how a mark is made, uses that motion for guided practice, and later turns recorded gestures into art across space and time. These animations illustrate the concept.

## 2. A finished letter hides the movement

The target users are beginners interested in graffiti and lettering, especially people without a suitable practice space. Physical practice uses consumable materials and requires appropriate ventilation. But the teaching problem is also movement: the finished S does not reveal tool distance, angle, pace or stroke order. Han and colleagues reviewed eighteen studies in physical education and found support for observational motor learning. That gives us a reason to test demonstration here, while leaving the graffiti-specific learning benefit as an open question.

[Han et al., 2022](https://doi.org/10.3390/ijerph191610109). [Krylon, How to Spray Paint](https://www.krylon.com/en/how-to/how-to-spray-paint)

## 3. The proposed learning sequence

There are strong existing tools. Kingspray’s official PC listing already describes spray simulation, replay, reference projection and interactive tutorials. Open Brush already supports painting in three-dimensional space. So neither replay nor spatial painting is the novelty claim. This project focuses on connecting expert motion, guided imitation, feedback and an independent attempt within one lettering lesson. The creative extension then reuses the same recording. We would evaluate that combination rather than assume it is better.

[Kingspray, official PC description](https://store.steampowered.com/app/471660/Kingspray_Graffiti_VR/). [Open Brush](https://openbrush.app/)

## 4. Learn different lettering styles

The curriculum explores different graffiti lettering styles. Handstyle develops signature rhythm. Bubble lettering uses inflated, rounded contours. Wildstyle combines letter bodies, overlaps and extensions. The photographs show how these styles appear on actual walls, while the animations break down their construction. Bubble S remains the semester lesson; Handstyle is a possible next lesson, and Wildstyle is a future direction.

[YANK tag (photo: Crazyank)](https://commons.wikimedia.org/wiki/File:Tag_yank.jpg). [SPLEEN, NSW (photo: Notcharizard)](https://commons.wikimedia.org/wiki/File:Bubble_writing_graffiti.jpg). [Germany, wall detail (photo: KOchstudiO)](https://commons.wikimedia.org/wiki/File:Wildstyle_graffiti.JPG)

## 5. A quiet space to practice

Players practice inside a quiet virtual concrete studio. The reference is Tadao Ando’s Langen Foundation: exposed concrete, natural light and a restrained interior. Our proposed layout places a guided practice wall beside a tool station, with a separate wall for free creation. The photograph is an architectural reference, not the proposed room layout.

[Langen Foundation, photo: Till Niermann](https://commons.wikimedia.org/wiki/File:Langen_Foundation_3,_2021.jpg)

## 6. Three tools, different control

The studio keeps the tool station beside the learning wall and a free creation wall. Spray is the main tool: the trigger controls paint, and distance changes its footprint. The marker uses tip contact and orientation for a crisp mark. The roller uses a broad contact region for fills. All three share the same paint infrastructure. These are approximations: Quest controllers do not reproduce real tip pressure, friction, aerosol resistance or the weight of each tool.

[Montana Cans product photography](https://www.montana-cans.com/Montana-BLACK-400ml/272073). [MTN / Spray Planet product photography](https://www.sprayplanet.com/products/mtn-street-paint-markers-15mm-orange). [Purdy product photography](https://www.purdy.co.uk/products/rollers/mini-roller-system/)

## 7. A first lesson: Bubble S

Imagine a beginner entering the studio and choosing Bubble S. First, Observe plays the recorded hand and tool motion, including its distance from the wall. During Trace, the learner follows a spatial trail while painting. A quiet distance cue helps them adjust without a stream of distracting alerts. The guide then fades. In Reproduce, the learner paints the letter independently and reviews the attempt afterward. They can request the demonstration again if needed. Finally, Remix invites a different proportion, color or tool. At that point, copying the target is no longer the objective. The animation shows that progression, including a learner cursor that follows rather than simply watching the letter draw itself.

## 8. Guidance that steps back

The guidance separates three layers: a target mark on the wall, a motion trail in front of it, and the hand and tool pose. Observational learning informs the demonstration of stroke order and timing. Scaffolding informs the move from full support to a faint trail and finally no overlay. Feedback distinguishes how the movement was performed from the resulting painted path. Yu and colleagues’ XR guidance framework also distinguishes advance movement cues from corrective feedback. VR is useful because these cues occupy the same space as the tracked hand and wall. We still need an unguided test: success while following an overlay is not enough to establish learning.

[Han et al., 2022](https://doi.org/10.3390/ijerph191610109). [Wulf et al., 2010](https://doi.org/10.1111/j.1365-2923.2009.03421.x). [Yu et al., CHI 2024](https://doi.org/10.1145/3613904.3642143). [Levac et al., 2019](https://doi.org/10.1186/s12984-019-0587-8)

## 9. An unguided test of learning

The optional pilot compares a conventional visual demonstration and target with ghost hand, tool and spatial trail. We would randomly assign beginners to a condition, keep practice duration equal, and use unguided pretests and posttests. For painted trajectory error, we anchor both paths to the same wall coordinates, resample the learner centerline at equal arc-length intervals, and average distance to the target curve. Separately, we log variation in can-to-wall distance while spraying. We compare change in those metrics, not an invented accuracy score. A small pilot would establish feasibility, not physical transfer.

[Levac et al., 2019](https://doi.org/10.1186/s12984-019-0587-8)

## 10. The recording becomes material

The same recording could also become creative material. Temporal Layers keeps earlier attempts as translucent parts of a composition. Instead of erasing every previous version, the artist makes that history visible. Time-to-Space maps elapsed stroke time to depth: early and late parts of a flat mark occupy different positions away from the wall. The perspective change shows the resulting spatial line. Both are concept animations and stretch directions. The semester commitment remains the lettering lesson, while the creative vision grows from data that lesson already needs.

## 11. One recording, several uses

The technical plan uses a Meta Quest headset with tracked controllers, Unity and C#, OpenXR, and the XR Interaction Toolkit. Tool input feeds a shared stroke engine. For the first planar wall, ray hits map to UV coordinates and brush stamps accumulate in a bounded RenderTexture. A recorder stores timestamped pose, tool settings and stroke data in wall coordinates. That supports ghost replay, lesson state and local metrics. The main risks are rendering cost and replay alignment. We would profile early on Quest, cap history, lower texture resolution if necessary, and calibrate wall height and reach. If scope slips, we simplify contact tools and protect the complete spray lesson.

[Unity, XR input options](https://docs.unity.com/en-us/engine/6000.0/manual/xr/configuring-project-for/scene-setup/input-overview)

## 12. One complete lesson

I’m developing this project solo, drawing on experience with Unity XR, interactive systems, visual design and media production. I own the design, code, creative direction, instrumentation and evaluation planning. The roadmap has four gates: a working spray wall, basic tools and the S target, recorded guidance with fading, and an independent attempt with logging and polish. Dates will follow the course deadline. The protected deliverable is one complete lesson. A participant pilot and temporal art interactions follow only if that core is stable. I’d welcome feedback on the guidance and the scope.

## 13. References (Backup)

Use the linked original papers and official product pages for questions about evidence. Han’s review concerns physical education, not graffiti. Levac’s review discusses learning and transfer limits across virtual environments. Yu’s paper provides a design space for XR movement cues and feedback. Wulf’s review informs observation and feedback choices. None validates the proposed application. Product comparisons describe documented capabilities rather than an exhaustive feature audit.

[Han et al., 2022](https://doi.org/10.3390/ijerph191610109). [Levac et al., 2019](https://doi.org/10.1186/s12984-019-0587-8). [Yu et al., CHI 2024](https://doi.org/10.1145/3613904.3642143). [Wulf et al., 2010](https://doi.org/10.1111/j.1365-2923.2009.03421.x). [Kingspray, official PC description](https://store.steampowered.com/app/471660/Kingspray_Graffiti_VR/). [Open Brush](https://openbrush.app/). [Krylon, How to Spray Paint](https://www.krylon.com/en/how-to/how-to-spray-paint). [Unity, XR input options](https://docs.unity.com/en-us/engine/6000.0/manual/xr/configuring-project-for/scene-setup/input-overview)

## 14. Discussion (Backup)

The most useful feedback concerns whether beginners can read the layered cues, which metric captures the intended skill, and whether the solo scope is credible. If asked about novelty, acknowledge existing spray simulation, replay and 3D painting. The contribution is the proposed learning sequence and how its recordings support a later creative interaction. If asked about the pilot, prioritize a stable lesson and verified logging before recruitment. For future implementation, resample the ink centerline at 100 equal arc-length positions in wall coordinates and compute mean nearest-target distance. Log tool distance at a fixed interval while the trigger is active. Report each metric separately, including pre/post change and individual patterns, with no underpowered superiority claim.

