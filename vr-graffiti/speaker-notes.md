# VR Graffiti: presenter script

11 main slides, 6:10 planned talk. One tools reference backup is retained for reuse.

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

Spray can, marker and roller behave differently. The spray lesson develops distance, speed and coverage. A marker develops controlled lines, sketching and precise outlines. A roller develops broad strokes, large fills and surface coverage. The three moving demonstrations are illustrative virtual tools. Spray Can is the MVP priority. Marker and Roller are optional extensions and can be omitted if time is limited.

## 8. Practicing Stroke Techniques

Consistent lines require precise control of distance, speed, and angle. The five moving spray cans compare the same stroke under different physical conditions. Ideal control creates a smooth, consistent line. Holding the can too close deposits excess paint and causes dripping. Holding it too far away leaves a faint mark with fuzzy edges. Moving too slowly creates local paint buildup. Tilting the can produces uneven spray distribution. The slow example visibly lingers while the paint grows denser. These are explanatory concept illustrations rather than a calibrated spray simulation.

## 9. Learning Lettering Styles

The supplied alphabet chart stays intact. Learners select individual letters to inspect their structure and proportions. The enlarged view is a detail from the same original image. The learning sequence is Observe, Trace, Reproduce, progressing toward words and tags. The chart does not establish an artist’s actual stroke order. Future lessons can demonstrate order and direction using recorded expert movement.

## 10. Creative Expression

The player gets a space for free creative exploration. They can choose a concrete, brick or metal wall, freely paint and experiment, and combine tools, strokes and lettering in their own work. The sandbox illustration shows separate studies in progress and leaves open space for new marks. Material choices change the wall while keeping the artwork. The color controls, painting gesture, Add stroke and Clear wall actions let the audience explore this concept. Customize the wall. Experiment with materials. Create your own style.

## 11. Technical Implementation Plan

Hardware and software: Meta Quest 3S, Unity, C#, and XR Interaction Toolkit. The core implementation tracks hand position, angle, speed, and distance from the wall. Spray behavior responds to movement. Recorded expert movements support replay and guided practice. This is the proposed implementation plan.

## 12. Three tools, different control (Backup)

The studio keeps the tool station beside the learning wall and a free creation wall. Spray is the main tool: the trigger controls paint, and distance changes its footprint. The marker uses tip contact and orientation for a crisp mark. The roller uses a broad contact region for fills. All three share the same paint infrastructure. These are approximations: Quest controllers do not reproduce real tip pressure, friction, aerosol resistance or the weight of each tool. Spray can is the MVP priority. Marker and roller remain optional extensions, time permitting.

[Montana Cans product photography](https://www.montana-cans.com/Montana-BLACK-400ml/272073). [MTN / Spray Planet product photography](https://www.sprayplanet.com/products/mtn-street-paint-markers-15mm-orange). [Purdy product photography](https://www.purdy.co.uk/products/rollers/mini-roller-system/)

