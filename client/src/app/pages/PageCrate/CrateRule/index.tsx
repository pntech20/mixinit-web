import './styles.scss';

interface CrateRuleProps {
  contributor: string;
  ruleText: string;
  textInput?: string;
  removeRule?: () => void;
}

export default function CrateRule({
  contributor = '',
  ruleText = '',
  textInput = '',
  removeRule,
}: CrateRuleProps) {
  return (
    <div className="rule-column">
      <div className="close" onClick={removeRule}>
        X
      </div>
      <div className="rule-text end">{contributor}</div>
      <div className="rule-text">{ruleText}</div>
      <div className="rule-text end">{textInput}</div>
    </div>
  );
}
