import * as React from 'react';
import { Steps } from 'antd';
import './BigSelect.less';
const Step = Steps.Step;
import { StepsProps } from 'antd/es/steps/index.d';
import './SFCStep.less';

export interface IStepsProps extends StepsProps {
  stepList: Array<{ title: string; description?: string }>;
  current: number;
  checkoutStep: (v: any) => void; // 第几步
}

type Props = IStepsProps;

const SFCSteps: React.SFC<Props> = (props: Props) => {
  return (
    <div className="k-steps">
      <Steps current={props.current} size="small" progressDot>
        {props.stepList.map((step, index) => (
          <Step
            onClick={(e: any) => {
              if (e.target.parentNode.className === 'ant-steps-item-content') {
                props.checkoutStep(e.target.parentNode.parentNode.id);
              }
            }}
            id={index + 1}
            key={step.title}
            title={step.title}
            description={step.description}
          />
        ))}
      </Steps>
    </div>
  );
};

export default SFCSteps;
