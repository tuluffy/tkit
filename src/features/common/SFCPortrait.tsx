import * as React from 'react';
import './SFCPortrait.less';

export interface ISFCPortraitProps {
  username: string;
  portrait: string;
  showPortrait: boolean;
}
type Props = ISFCPortraitProps;

export const SFCPortrait: React.SFC<Props> = (props: Props) => {
  return (
    <dl className="k-portrait">
      <dt>
        <img src={props.portrait} alt="" />
      </dt>
      {props.showPortrait && <dd>{props.username}</dd>}
    </dl>
  );
};

export default SFCPortrait;
