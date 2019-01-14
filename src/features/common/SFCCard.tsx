import * as React from 'react';
import './SFCCard.less';
export interface INav {
  num: number;
  text: string;
  color: string;
}
export interface ISFCCardProps {
  width: number;
  height: number;
  title?: string;
  num?: number;
  text?: string;
  color?: string;
  icon?: string;
  contentArray?: INav[];
}
type Props = ISFCCardProps;

export const SFCCard: React.SFC<Props> = (props: Props) => {
  return (
    <div
      className="common-presenter k-common-card"
      style={{ width: props.width, height: props.height }}
    >
      <div className="card-head">
        <i className={`kiconfont ${props.icon}`} />
        <h2 className="card-head-title">{props.title}</h2>
      </div>
      <div className="card-body">
        {!props.contentArray && (
          <div className="card-content">
            <p className="card-num" style={{ color: props.color }}>
              {props.num}
            </p>
            <p className="card-text">{props.text}</p>
          </div>
        )}
        {props.contentArray &&
          props.contentArray.map((item, index) => {
            return (
              <div className="card-content-wrap" key={index}>
                <p className="card-num" style={{ color: item.color }}>
                  {item.num}
                </p>
                <p className="card-text">{item.text}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SFCCard;
