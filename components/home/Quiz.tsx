"use client";

import { useState } from "react";

const questions = [
  { key: "who", title: "Who’s coming along?", hint: "Tell us who this trip is for.", options: [["Family with kids", "users"], ["Couple", "heart"], ["Solo", "user"], ["Group", "users-group"]] },
  { key: "vibe", title: "What’s the vibe?", hint: "Pick what sounds most like your ideal trip.", options: [["beach", "beach"], ["cruise", "ship"], ["culture", "building-castle"], ["adventure", "compass"]] },
  { key: "budget", title: "And the budget?", hint: "This just helps us tailor the options.", options: [["Value", "coin"], ["Mid", "diamond"], ["Luxury", "crown"], ["Flexible", "sparkles"]] },
] as const;
const labels: Record<string, string> = { beach: "Beach & total relaxation", cruise: "Cruise & multiple stops", culture: "Culture & European cities", adventure: "Island adventure" };
const results: Record<string, [string, string]> = {
  beach: ["An All-Inclusive Beach Escape", "Sun, sand, and zero logistics — a resort where everything’s covered so everyone just relaxes."],
  cruise: ["A Tailored Family Cruise", "One floating resort, many destinations, and something fun for every age at each stop."],
  culture: ["A European Adventure", "Castles, coastlines and cities — curated so you experience Europe without the overwhelm."],
  adventure: ["A Caribbean Discovery", "Turquoise water, island exploring and unforgettable moments, planned end to end."],
};

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const result = results[answers.vibe] || results.beach;
  return (
    <section className="section bg-dark-1" id="quiz">
      <div className="container"><div className="sec-head text-center" data-animate><span className="eyebrow center">Signature experience</span><h2>Find your perfect trip in 60 seconds</h2><p className="lead-p mx-auto">Answer three quick questions and we&apos;ll point you to the getaway your family will love.</p></div>
        <div className="quiz-wrap" data-animate><div className="quiz-progress"><i style={{ width: `${((step + 1) / 4) * 100}%` }} /></div>
          {step < questions.length ? (() => { const question = questions[step]; return <div className="quiz-step active"><div className="quiz-q">{question.title}</div><p className="quiz-hint">{question.hint}</p><div className="quiz-opts">{question.options.map(([value, icon]) => <button type="button" key={value} className={`quiz-opt${answers[question.key] === value ? " sel" : ""}`} onClick={() => { setAnswers((current) => ({ ...current, [question.key]: value })); window.setTimeout(() => setStep(step + 1), 180); }}><i className={`ti ti-${icon}`} /><span>{labels[value] || value}</span></button>)}</div><div className="quiz-nav"><button className="quiz-back" type="button" disabled={!step} onClick={() => setStep(step - 1)}><i className="ti ti-arrow-left" /> Back</button></div></div>; })() :
            <div className="quiz-step active"><div className="quiz-result"><span className="k">Your match</span><h3>{result[0]}</h3><p>{result[1]}</p><a className="btn btn--gold" href="#contact">Get my custom quote <i className="ti ti-arrow-right" /></a><div className="quiz-nav" style={{ justifyContent: "center", marginTop: 26 }}><button className="quiz-back" type="button" onClick={() => setStep(2)}><i className="ti ti-arrow-left" /> Change answers</button></div></div></div>}
        </div>
      </div>
    </section>
  );
}
