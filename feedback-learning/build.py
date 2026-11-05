"""Build the static presentation from the reviewed content below. No dependencies."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SLIDES = []


def slide(section, title, body, notes, source, kind=""):
    SLIDES.append(dict(section=section, title=title, body=body, notes=notes, source=source, kind=kind))


slide("A paper about learning movement", "Feedback &<br><span>motor skill learning</span>", '''
<p class="cover-question">What helps a student improve their next attempt?</p>
<div class="cover-study"><p>Effects of Feedback on Students’ Motor Skill Learning<br>in Physical Education: A Systematic Review</p><p class="small">Yulan Zhou · Wei De Shao · Lijuan Wang<br>IJERPH, 2021 · 23 studies reviewed</p></div>
<p class="cover-foot">School PE · Feedback design · Implications for XR</p>''',
"这是一篇系统综述，不是作者自己招募学生做的新实验。它整理已有研究，回答体育课中反馈是否帮助学生学习动作，以及不同反馈形式和内容是否产生不同效果。先记住主线：学生完成一次动作以后，什么信息能帮助他改进下一次尝试？前四部分对应第2至9页。",
"Zhou, Shao & Wang (2021) · IJERPH 18, 6281", "cover")

slide("1 / Problem & motivation", "Practice gives students a turn.<br>Feedback gives them information.", '''
<div class="attempt"><div><span class="label">A student throws a ball</span><p class="big-line">The ball misses.</p><p>Another attempt provides more practice.<br>It may not reveal what to change.</p></div><div class="example"><span class="label">An illustrative teacher cue</span><blockquote>“Next time, step forward<br>with your opposite foot.”</blockquote><p>The learner gets something specific to try.</p></div></div>
<p class="bottom-line">Why PE matters: motor competence is associated with physical activity and fitness. School PE is an important place to develop it.</p>''',
"先想象一个学生投球没投中。再练一次当然增加了练习机会，但学生不一定知道哪里出了问题。老师给出具体提示，可能让下一次练习更有方向。这只是帮助理解的例子，不是论文中的实验原话。论文的大背景是运动技能与身体活动、体适能有关，学校体育是重要学习场所。注意，这是相关关系；本文没有直接检验反馈是否改善健康，也不是说没有反馈就无法学习。",
"Paper §1 · Throwing cue is an illustrative example")

slide("1 / Problem & motivation", "Does feedback help?<br>And does its design matter?", '''
<div class="question-row"><span class="question-number">01</span><div><h3>Feedback or no feedback?</h3><p>Some PE studies report improvements.<br>Others find no significant difference.</p></div></div>
<div class="question-row"><span class="question-number">02</span><div><h3>Which format and content?</h3><p>“Good effort,” a movement cue, and a video replay<br>all provide different kinds of information.</p></div></div>
<p class="bottom-line">The gap: the authors identified a need to synthesize intervention evidence specifically from school PE.</p>''',
"已有研究结果不一致，所以不能只凭直觉认为反馈一定有效。而且反馈这个词覆盖了表扬、具体动作指导和视频等不同干预。作者问两个问题：反馈总体是否有用，以及形式和内容会不会改变效果。没有显著差异不等于证明没有效果，也可能与样本量或研究设计有关。这里的综述空白指当时学校体育运动技能这个特定范围，不是整个教育界从未研究过反馈。",
"Paper §§1–2 · Research questions")

slide("2 / Key concepts", "One feedback message.<br>Three ways to describe it.", '''
<blockquote class="hero-quote"><span>“Good effort.</span> Next time, step forward<br>with your opposite foot.”</blockquote>
<div class="three-columns"><div><span class="label">Who? / Provider</span><h3>The teacher</h3><p>A peer can also provide feedback.</p></div><div><span class="label">How? / Format</span><h3>Spoken words</h3><p>Video is another delivery format.</p></div><div><span class="label">What? / Content</span><h3>Praise + information</h3><p>Encouragement plus a movement cue.</p></div></div>
<p class="bottom-line">A single intervention can combine a provider, a format, and several types of content.</p>''',
"同一句反馈可以从三个维度描述：谁提供、怎样呈现、具体说了什么。老师口头说一句表扬加动作指导，就同时包含教师、语言、表扬和信息反馈。这些不是互斥类别。论文也区分信息反馈与纠错，但现实中二者可能重叠，例如指出手臂过低既是动作信息也是纠错。这种重叠使研究之间更难直接比较。例句为本演示的教学示例，不是原文引文。",
"Paper §§2.3, 4.2–4.3 · Message is an illustrative example")

slide("2 / Explanatory framework", "What learners need may change<br>with experience and the task.", '''
<div class="stages"><div><span class="label">Cognitive / 认知</span><h3>How do I do it?</h3><p>Understand the movement.</p></div><div><span class="label">Associative / 联结</span><h3>How do I get consistent?</h3><p>Refine the movement pattern.</p></div><div><span class="label">Autonomous / 自动化</span><h3>What needs adjusting?</h3><p>Fine-tune a familiar skill.</p></div></div>
<div class="task-line"><h3>The task matters, too.</h3><p>One throw has a clear start and finish. Swimming repeats continuously.<br>Responding to a moving opponent adds changing perceptual demands.</p></div>
<p class="bottom-line"><strong>An explanation to investigate.</strong> The review does not establish stage-specific rules or an optimal feedback frequency.</p>''',
"作者在讨论中借助 Fitts 与 Posner 的认知、联结、自动化三阶段解释反馈需要为什么可能不同。新手先理解动作，练习者追求稳定，熟练者微调。中间阶段的提问是为解释模型而补充的概括，不是本文独立检验的结论。作者还按动作类型和知觉特征编码任务：离散、连续、序列，开放或封闭。注意离散不等于简单、连续不等于复杂。这些理论主要用于解释研究结果，没有被系统检验为反馈处方。频率研究尤其不足。",
"Paper §§2.3, 4.2–4.3 · Fitts & Posner (1967), cited in the paper")

slide("3 / Research contribution", "The review separates usefulness<br>from the choice of feedback.", '''
<div class="contribution"><div><span class="label">Organize</span><h3>Bring 23 studies together.</h3><p>Focus on feedback interventions in real school PE classes.</p></div><div><span class="label">Compare</span><h3>Separate the design questions.</h3><p>Presence of feedback, delivery format, and feedback content.</p></div><div><span class="label">Judge</span><h3>Make uncertainty visible.</h3><p>Grade support using study quality and consistency of findings.</p></div></div>
<p class="bottom-line">The contribution is an evidence synthesis and a research agenda. It does not introduce a new theory of learning.</p>''',
"这篇论文增加的认识不是一个全新的学习理论，而是整理了学校体育中的干预证据。最关键的是把两件事分开：反馈是否通常有帮助，和具体哪一种反馈更好。前者的支持比后者更充分。研究贡献还包括标明证据强弱、指出需要高质量研究的地方。贡献是做了什么新的整理；结果是整理以后具体发现了什么。不要把教师建议当作每项都已证明的新发现。",
"Paper §§1, 3.4, 5–6")

slide("4 / Research approach", "How did studies enter<br>the review?", '''
<div class="search-flow"><div><strong>7</strong><span>databases searched<br>through April 2021</span></div><span class="connector" aria-hidden="true">→</span><div><strong>139</strong><span>potentially relevant<br>studies after screening</span></div><span class="connector" aria-hidden="true">→</span><div><strong>23</strong><span>included studies<br>21 + 2 from reference lists</span></div></div>
<div class="criteria"><h3>What qualified?</h3><p>A deliberate feedback intervention · School PE<br>General elementary or secondary students<br>Peer-reviewed English full text</p></div>
<p class="bottom-line">Two reviewers independently screened studies. A third helped resolve disagreements. PRISMA guides transparent reporting.</p>''',
"系统综述需要明确检索和筛选标准，避免只选支持自己观点的文献。作者搜索七个数据库，截至2021年4月，最初识别16894条记录。经过筛选有139项潜在相关研究，数据库最终纳入21项，追溯参考文献再补2项，共23项。只纳入学校体育中的反馈干预和普通中小学生，排除学前、大学和残障样本，以及非英文和未发表材料。两名评审者独立筛选，第三人协助解决分歧。PRISMA是报告规范，能提高透明度，但不自动保证证据质量。图中为简化流程，不是完整PRISMA图。",
"Paper §§2.1–2.2, 3.1 · Simplified selection process")

slide("4 / Research approach", "What kind of evidence<br>did they find?", '''
<div class="evidence-profile"><div class="sample-stat"><strong>23</strong><p>studies published<br>1987–2019</p></div><div class="profile-text"><h3>School students. Different skills.</h3><p>12 elementary · 7 middle · 4 high school studies<br>Throwing, volleyball, swimming, gymnastics, and more.</p><h3>Many small studies.</h3><p>Samples ranged from 3 to 950 students.<br>16 studies had fewer than 100 participants.</p></div></div>
<div class="design-contrast"><p><strong>Pre–post:</strong> did students improve after practice?<br><span>Improvement may reflect practice as well as feedback.</span></p><p><strong>Randomized comparison:</strong> did groups differ?<br><span>Five studies were classified as RCTs by the authors.</span></p></div>''',
"这23项研究分布在小学到高中，任务差异较大。样本从3到950，16项不到100人。作者把其中5项归为随机对照试验。前后测能看见练习后是否进步，但不能单独证明进步由反馈造成；随机分组比较通常更有助于因果推断。注意原文对随机化的总结和质量表有不一致，因此这里采用作者对研究设计的分类，不把5项RCT直接换算成其余研究完全没有随机分配。不同任务和设计也为下一页的质量评价做铺垫。",
"Paper §3.2 & Table 1 · Designs as classified by the authors")

slide("4 / Research approach", "A study’s quality and a conclusion’s<br>support are different judgments.", '''
<div class="quality-split"><div><span class="label">One study / PEDro</span><h3>How trustworthy<br>is its design?</h3><p>Random allocation, blinding,<br>reporting, and related criteria.</p><p class="quality-count"><strong>8</strong> higher quality <span> / </span><strong>15</strong> lower quality</p><p class="small">Authors’ threshold: ≥5 out of 10.</p></div><div><span class="label">Across studies / Best-evidence synthesis</span><h3>How much support<br>does a claim have?</h3><p>Consider quality, quantity,<br>and consistency of findings.</p><p class="grade-line">Strong · Moderate · Limited<br>Conflicting · Insufficient</p><p class="small">Consistent: ≥⅔ significant in the same direction.</p></div></div>
<p class="bottom-line">No pooled effect size: interventions were too varied. “Strong evidence” describes support under this grading scheme, not the size of improvement.</p>''',
"这里一定要区分两层判断。第一层用PEDro评估一项研究的设计和报告，本文按5分划线，8项高质量、15项低质量。第二层评估一个结论得到多少支持，综合数量、质量、一致性。强证据需要至少3项高质量研究结果总体一致，中等需要2项，有限需要1项。一致是至少三分之二结果在同方向显著。作者因干预差异较大没有做元分析，所以没有合并后的平均效果。强证据不等于效果很大，也不等于每个学生都获益。你负责的前四部分可以在这里交给下一位同学。",
"Paper §§2.4–2.5, 3.3 · PEDro & best-evidence synthesis")

slide("5 / Key findings", "Feedback has the clearest support.<br>The best format is less certain.", '''
<table><thead><tr><th>Comparison</th><th>Reported findings</th><th>Evidence rating</th></tr></thead><tbody><tr><td>Feedback vs. none</td><td>10 of 13 favor feedback</td><td><strong>Strong</strong></td></tr><tr><td>Praise + information vs. praise</td><td>2 of 3 favor the combination</td><td><strong>Moderate</strong></td></tr><tr><td>Visual vs. verbal</td><td>3 of 3 favor visual</td><td>Limited</td></tr><tr><td>Information vs. praise or correction</td><td>4 of 7 favor information</td><td>Conflicting</td></tr></tbody></table>
<p class="bottom-line">Counts follow the authors’ synthesis. A study can contribute more than one result; these are not all independent replications.</p>''',
"作者评为强证据的是反馈对比无反馈。表扬加具体信息对比单纯表扬是中等。视觉对比语言尽管三项方向一致，但只有一项高质量，因此只有有限证据。信息反馈与表扬或纠错的比较不一致。计数沿用原文，某些研究贡献了多个结果，不能把它们全当独立重复。原文专家示范对比自我示范的高质量支持计数与表格不一致，因此主表不复述这个有争议数字。",
"Paper §§3.4, 6 · Authors’ evidence classifications")

slide("5 / Interpretation", "Encouragement can come with<br>something specific to try.", '''
<div class="feedback-contrast"><div><span class="label">Praise alone</span><blockquote>“Good effort.”</blockquote><p>May support motivation.<br>Provides little movement information.</p></div><div><span class="label">Praise + information</span><blockquote>“Good effort.<br><span>Step forward with<br>your opposite foot.”</span></blockquote></div></div>
<p class="bottom-line">Moderate evidence favors combining praise and information. The review does not establish the mechanisms behind that benefit.</p>''',
"这页把结果转成一个直观例子。单纯表扬可能支持动机，但没有告诉学生下一次怎样改。表扬加具体动作信息兼顾鼓励与动作指导，比较得到中等证据支持。不要说表扬一定提高动机或只有指出哪里做对才有效。信息可以说明下一步怎么调整。示例为说明概念，不是原文实验逐字引语。",
"Paper §§3.4.3, 4.3 · Illustrative feedback messages")

slide("6 / Critical evaluation", "A useful synthesis.<br>An uneven evidence base.", '''
<div class="critique-columns"><div><span class="label">What strengthens the review</span><h3>A transparent process</h3><p>Seven databases and reference searches.<br>Independent screening and quality ratings.<br>Study characteristics reported in detail.</p></div><div><span class="label">What limits the conclusions</span><h3>Quality and comparability</h3><p>15 of 23 studies rated lower quality.<br>No study blinded outcome assessors.<br>Different tasks and combined interventions.</p></div></div>
<div class="critique-note"><h3>What remains unresolved?</h3><p>The average benefit, optimal frequency, long-term retention, and which feedback suits which learner.</p></div>''',
"这篇综述的价值是检索和评审透明，也如实报告研究质量限制。主要问题来自原始研究：小样本、低质量、没有评估者盲法，加上任务与反馈组合不同，难以分离究竟哪个成分有效。只计显著方向不能估计平均效果大小。英文发表限制也可能使证据不完整。还可指出原文专家示范比较的质量计数与表格不一致，说明综述本身也要批判性阅读。",
"Paper §§4.4–5 · Evaluation combines author limitations and presenter critique")

slide("6 / What counts as learning?", "Does the improvement remain<br>when the feedback disappears?", '''
<div class="testing-sequence"><div><span class="label">During practice</span><h3>Performance</h3><p>Can the learner do better<br>with guidance available?</p></div><div><span class="label">After a delay</span><h3>Retention</h3><p>Can they still perform<br>without that guidance?</p></div><div><span class="label">In another setting</span><h3>Transfer</h3><p>Can they use the skill<br>in the real target task?</p></div></div>
<p class="bottom-line">Presenter’s critique: the review does not systematically separate these outcomes. Durable learning needs more than a better practice score.</p>''',
"这页是补充批判框架，不是作者证明的结果。即时表现、延迟保持、迁移是不同评价问题。综述没有系统区分这些结果，因此不能只凭练习中表现变好就确定形成持久技能。也不要说多数研究没有保持测试，因为这需要逐篇核查原始文献。对于XR，这意味着应该测试撤去虚拟提示后的独立表现与真实任务表现。",
"Presenter’s evaluation of the review’s outcome synthesis")

slide("7 / Connection to XR", "XR can test feedback designs.<br>It cannot assume they work.", '''
<div class="xr-rows"><div><h3>Replay a movement</h3><p>Compare visual replay with the same spoken guidance.<br>Video evidence does not establish the benefit of 3D overlays.</p></div><div><h3>Pair encouragement with a cue</h3><p>Give a concrete next action.<br>Praise findings do not directly establish benefits from badges.</p></div><div><h3>Vary when guidance appears</h3><p>Test frequency or learner-requested feedback.<br>Feedback benefits do not imply feedback on every attempt.</p></div></div>
<p class="bottom-line">Design hypotheses beyond the paper’s direct evidence. Evaluate tracking accuracy, independent performance, retention, and transfer.</p>''',
"XR不是这篇综述的研究对象，这页全部是设计假设。可以测试动作回放、具体语言提示、学习者自行请求反馈等。视频有潜力并不证明实时三维叠加或第一人称化身更有效。表扬也不等于游戏化分数徽章。有反馈优于无反馈不意味着每次都要给反馈。自动评分可能减少主观判断，但仍需验证追踪准确性和评分有效性。",
"Presenter’s XR design hypotheses, informed by paper §§4–5")

slide("8 / A concrete application", "An AR throwing coach,<br>with a testable learning claim.", '''
<div class="application"><div><span class="label">After an attempt</span><h3>Replay. Encourage.<br>Give one movement cue.</h3><p>Show the throw alongside an expert example.<br>“Good effort. Step forward with your opposite foot.”</p><p class="small">Proposed prototype, not a tested system in the review.</p></div><div><span class="label">Compare equal practice time</span><ol class="conditions"><li>Praise alone</li><li>Praise + movement information</li><li>The same information + visual replay</li></ol><p class="measure">Then test without assistance:<br><strong>accuracy · delayed retention · real throws</strong></p></div></div>
<p class="bottom-line">The comparison isolates the added value of information and replay. Improvement in the headset is only the first outcome.</p>''',
"具体应用是AR投掷教练。完成一次投掷后看回放，与专家动作并排，再给鼓励和一个具体动作提示。这个设计没有经过本文验证。实验比较三组：仅表扬；表扬加动作信息；相同信息再加视觉回放。练习时间与机会保持一致，尽可能隔离不同成分的作用。评估真实投掷准确性、延迟保持，以及撤去提示后的独立表现，不能只看系统内分数。",
"Proposed application and evaluation design · Not an intervention tested by this paper")

slide("Takeaways", "Feedback helps.<br><span>Its design still needs testing.</span>", '''
<div class="closing-points"><p><strong>Clearest support</strong> Feedback compared with none.</p><p><strong>Moderate support</strong> Praise combined with movement information.</p><p><strong>Still open</strong> Best format, frequency, and learner-specific design.</p></div>
<p class="reference">Zhou, Y., Shao, W. D., & Wang, L. (2021). Effects of Feedback on Students’ Motor Skill Learning in Physical Education: A Systematic Review. <em>IJERPH, 18</em>(12), 6281.<br><a href="https://doi.org/10.3390/ijerph18126281" target="_blank" rel="noopener">doi.org/10.3390/ijerph18126281 ↗</a></p>''',
"总结：反馈对比无反馈得到最明确支持，表扬结合具体信息有中等支持。其他形式、频率和个性化设计仍需检验。XR可以帮助实现并研究这些设计，但本论文不能证明XR优越。最后回到第一张的问题：学生下一次尝试需要什么信息，以及撤掉系统后是否真的学会。",
"Zhou, Shao & Wang (2021) · Conclusions and proposed implications", "closing")


def build():
    sections = []
    for i, s in enumerate(SLIDES, 1):
        sections.append(f'''<section class="slide {s['kind']}" id="slide-{i}" aria-labelledby="title-{i}">
<header><p class="eyebrow">{html.escape(s['section'])}</p><span class="folio">{i:02d} / {len(SLIDES):02d}</span></header>
<h{'1' if i == 1 else '2'} id="title-{i}">{s['title'].replace('<br>', '<br> ')}</h{'1' if i == 1 else '2'}>
<div class="slide-body">{s['body'].replace('<br>', '<br> ')}</div>
<footer class="source">{html.escape(s['source'])}</footer></section>''')
    data = json.dumps([dict(title=s['title'].replace('<br>', ' ').replace('<span>', '').replace('</span>', ''), section=s['section'], notes=s['notes']) for s in SLIDES], ensure_ascii=False).replace('</', '<\\/')
    template = (ROOT / "template.html").read_text(encoding="utf-8")
    (ROOT / "index.html").write_text(template.replace("<!-- SLIDES -->", "\n".join(sections)).replace("<!-- DATA -->", data), encoding="utf-8")
    notes = "# Feedback & motor skill learning\n\n英文投影，中文逐页讲解。前四部分：第 2–9 页。\n\n"
    for i, s in enumerate(SLIDES, 1):
        title = s['title'].replace('<br>', ' ').replace('<span>', '').replace('</span>', '')
        notes += f"## {i}. {title}\n\n{s['notes']}\n\nSource: {s['source']}\n\n"
    (ROOT / "speaker-notes.md").write_text(notes.rstrip() + "\n", encoding="utf-8")
    print(f"Built {len(SLIDES)} slides and Chinese speaker notes.")


if __name__ == "__main__":
    build()
