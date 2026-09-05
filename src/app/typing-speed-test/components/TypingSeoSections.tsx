import React from 'react';

const sections = [
  {
    id: 'what-is-gross-wpm',
    icon: '📊',
    title: 'What is Gross WPM?',
    color: 'text-violet-400',
    border: 'border-violet-500/20',
    bg: 'bg-violet-500/5',
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Gross WPM (Words Per Minute)</strong> measures your raw typing speed without penalizing for errors. It counts every character you type — correct or incorrect — and converts that into a word count using the standard 5-character-per-word formula.
        </p>
        <div className="mt-4 glass-card rounded-xl p-4 font-mono text-sm">
          <p className="text-violet-400 font-bold mb-1">Formula:</p>
          <p className="text-foreground">Gross WPM = Total Characters Typed ÷ 5 ÷ Minutes</p>
          <p className="text-muted-foreground mt-2 text-xs">Example: 500 characters in 2 minutes = 500 ÷ 5 ÷ 2 = <span className="text-violet-400">50 Gross WPM</span></p>
        </div>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Gross WPM is useful for understanding your maximum potential speed, but it doesn&apos;t reflect real-world typing accuracy. A typist with 100 Gross WPM but 50% accuracy is far less productive than one with 70 Gross WPM and 99% accuracy.
        </p>
      </>
    ),
  },
  {
    id: 'what-is-net-wpm',
    icon: '🎯',
    title: 'What is Net WPM?',
    color: 'text-primary',
    border: 'border-primary/20',
    bg: 'bg-primary/5',
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Net WPM</strong> is the industry-standard metric for measuring true typing proficiency. It subtracts your error rate from your gross speed, giving a more accurate picture of your effective typing performance.
        </p>
        <div className="mt-4 glass-card rounded-xl p-4 font-mono text-sm space-y-2">
          <p className="text-primary font-bold mb-1">Formula:</p>
          <p className="text-foreground">Net WPM = Gross WPM − Errors Per Minute</p>
          <p className="text-muted-foreground text-xs">or equivalently:</p>
          <p className="text-foreground">Net WPM = (Correct Characters ÷ 5) ÷ Minutes</p>
          <p className="text-muted-foreground mt-2 text-xs">Example: 50 Gross WPM with 3 errors/min = <span className="text-primary">47 Net WPM</span></p>
        </div>
        <p className="text-muted-foreground leading-relaxed mt-3">
          Most employers, typing certifications, and competitions use Net WPM as the official score. It rewards both speed AND accuracy simultaneously.
        </p>
      </>
    ),
  },
  {
    id: 'how-typing-speed-calculated',
    icon: '🔢',
    title: 'How is Typing Speed Calculated?',
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/5',
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed">
          Typing speed is calculated using a standardized system where <strong className="text-foreground">1 word = 5 characters</strong> (including spaces). This normalization allows fair comparison regardless of whether someone types short or long words.
        </p>
        <div className="mt-4 space-y-3">
          {[
            { step: '1', title: 'Count all characters typed', desc: 'Every keystroke counts — letters, spaces, punctuation, numbers.' },
            { step: '2', title: 'Divide by 5', desc: 'Convert characters to "standard words" (5 chars = 1 word).' },
            { step: '3', title: 'Divide by minutes elapsed', desc: 'Normalize to a per-minute rate.' },
            { step: '4', title: 'Subtract errors per minute', desc: 'Deduct error rate to get Net WPM.' },
          ]?.map((s) => (
            <div key={s?.step} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0 mt-0.5">{s?.step}</div>
              <div>
                <p className="text-sm font-semibold text-foreground">{s?.title}</p>
                <p className="text-xs text-muted-foreground">{s?.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'what-is-good-typing-speed',
    icon: '🏆',
    title: 'What is a Good Typing Speed?',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/5',
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed">
          Typing speed benchmarks vary by profession and use case. Here&apos;s a comprehensive breakdown of what different WPM ranges mean:
        </p>
        <div className="mt-4 space-y-2">
          {[
            { range: '< 20 WPM', label: 'Beginner', desc: 'Hunt-and-peck typist. Focus on learning touch typing.', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
            { range: '20–40 WPM', label: 'Below Average', desc: 'Casual typist. Regular practice will improve speed quickly.', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
            { range: '40–60 WPM', label: 'Average', desc: 'Average adult typist. Sufficient for most everyday tasks.', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
            { range: '60–80 WPM', label: 'Above Average', desc: 'Proficient typist. Meets most professional requirements.', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
            { range: '80–100 WPM', label: 'Fast', desc: 'Professional typist level. Excellent for office work.', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
            { range: '100+ WPM', label: 'Expert', desc: 'Top-tier typist. Transcriptionists, competitive typists.', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          ]?.map((tier) => (
            <div key={tier?.range} className={`flex items-center gap-3 p-3 rounded-xl ${tier?.bg} border ${tier?.border}`}>
              <div className={`font-mono text-sm font-bold ${tier?.color} w-24 shrink-0`}>{tier?.range}</div>
              <div>
                <span className={`text-sm font-semibold ${tier?.color}`}>{tier?.label}</span>
                <span className="text-xs text-muted-foreground ml-2">{tier?.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'gross-wpm-vs-net-wpm',
    icon: '⚖️',
    title: 'Gross WPM vs Net WPM',
    color: 'text-indigo-400',
    border: 'border-indigo-500/20',
    bg: 'bg-indigo-500/5',
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed">
          Understanding the difference between Gross and Net WPM is crucial for accurately assessing your typing ability.
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card rounded-xl p-4 border-violet-500/20">
            <h5 className="font-bold text-violet-400 mb-2 flex items-center gap-2">📊 Gross WPM</h5>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-violet-400">•</span> Counts ALL characters typed</li>
              <li className="flex gap-2"><span className="text-violet-400">•</span> No penalty for errors</li>
              <li className="flex gap-2"><span className="text-violet-400">•</span> Shows maximum raw speed</li>
              <li className="flex gap-2"><span className="text-violet-400">•</span> Always ≥ Net WPM</li>
              <li className="flex gap-2"><span className="text-violet-400">•</span> Less used in professional settings</li>
            </ul>
          </div>
          <div className="glass-card rounded-xl p-4 border-primary/20">
            <h5 className="font-bold text-primary mb-2 flex items-center gap-2">🎯 Net WPM</h5>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-primary">•</span> Counts only correct characters</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Penalizes errors</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Shows effective typing speed</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Always ≤ Gross WPM</li>
              <li className="flex gap-2"><span className="text-primary">•</span> Industry standard metric</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 glass-card rounded-xl p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Key insight:</strong> The gap between Gross and Net WPM reveals your error rate. A small gap means high accuracy; a large gap means you&apos;re making many mistakes. Aim to minimize this difference.
        </div>
      </>
    ),
  },
  {
    id: 'how-to-improve-typing-speed',
    icon: '🚀',
    title: 'How to Improve Typing Speed',
    color: 'text-rose-400',
    border: 'border-rose-500/20',
    bg: 'bg-rose-500/5',
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed">
          Improving typing speed is a skill that requires consistent practice and proper technique. Here are proven strategies to boost your WPM:
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: '🖐️', title: 'Learn Touch Typing', desc: 'Use all 10 fingers with proper home row positioning (ASDF / JKL;). Never look at the keyboard.' },
            { icon: '🎯', title: 'Accuracy First', desc: 'Focus on accuracy before speed. Slow down until you can type with 95%+ accuracy, then gradually increase speed.' },
            { icon: '⏱️', title: 'Daily Practice', desc: 'Practice 15–30 minutes daily. Consistency beats marathon sessions. Use typing tests regularly to track progress.' },
            { icon: '💪', title: 'Proper Posture', desc: 'Sit upright, wrists slightly elevated, fingers curved. Good ergonomics prevent fatigue and injury.' },
            { icon: '🔤', title: 'Learn Common Words', desc: 'The 200 most common English words make up 80% of text. Mastering them dramatically improves real-world speed.' },
            { icon: '📈', title: 'Track Progress', desc: 'Use our test regularly with different difficulty levels. Monitor your Net WPM trend over weeks and months.' },
          ]?.map((tip) => (
            <div key={tip?.title} className="glass-card rounded-xl p-4 flex gap-3">
              <span className="text-2xl shrink-0">{tip?.icon}</span>
              <div>
                <p className="text-sm font-semibold text-foreground">{tip?.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{tip?.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  },
];

export default function TypingSeoSections() {
  return (
    <section className="space-y-6 mt-8">
      <div className="text-center mb-8">
        <h2 className="text-section-title font-bold text-foreground">
          Typing Speed <span className="text-primary">Guide</span>
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Everything you need to know about WPM, typing metrics, and how to improve your typing speed.
        </p>
      </div>
      {sections?.map((section) => (
        <div
          key={section?.id}
          id={section?.id}
          className={`glass-card rounded-2xl p-6 border ${section?.border}`}
        >
          <h3 className={`text-lg font-bold ${section?.color} flex items-center gap-2 mb-4`}>
            <span>{section?.icon}</span>
            {section?.title}
          </h3>
          {section?.content}
        </div>
      ))}
      {/* FAQ Schema structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'What is Gross WPM?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Gross WPM measures raw typing speed using the formula: Total Characters Typed ÷ 5 ÷ Minutes. It counts all characters without penalizing errors.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is Net WPM?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Net WPM is the industry-standard typing speed metric calculated as: Gross WPM − Errors Per Minute. It accounts for accuracy and reflects true typing proficiency.',
                },
              },
              {
                '@type': 'Question',
                name: 'What is a good typing speed?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'The average adult types 40–60 WPM. Professional typists achieve 60–80 WPM. Expert typists exceed 100 WPM. For most office work, 60+ WPM with high accuracy is considered proficient.',
                },
              },
              {
                '@type': 'Question',
                name: 'How is typing speed calculated?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Typing speed is calculated by counting total characters typed, dividing by 5 (standard word length), then dividing by minutes elapsed. Net WPM further subtracts errors per minute.',
                },
              },
            ],
          }),
        }}
      />
    </section>
  );
}
