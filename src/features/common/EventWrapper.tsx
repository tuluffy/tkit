import * as React from 'react';

import { EventCenter } from '@src/utils/';

// own props
export interface IEventWrapperProps extends React.Props<any> {
  on: Callback;
  once: Callback;
  emit: Emit;
}

interface IEventWrapperHOCProps {
  Cp: React.SFC | React.ComponentClass;
  originProps: any;
}

type Callback = (event: string, info: any) => any;
type Emit = (event: string, info: any) => any;

export class EventWrapper extends React.PureComponent<IEventWrapperHOCProps> {
  public observerList: any[];
  public on: Callback;
  public once: Callback;
  public emit: Emit;
  constructor(props: IEventWrapperHOCProps) {
    super(props);
    this.observerList = [];
    this.on = (event: string, callback: Callback) => {
      EventCenter.on(event, callback);
      const observer = () => EventCenter.removeListener(event, callback);
      this.observerList.push(observer);
      return observer;
    };
    this.once = (event: string, callback: Callback) => {
      EventCenter.once(event, callback);
      const observer = () => EventCenter.removeListener(event, callback);
      this.observerList.push(observer);
      return observer;
    };
    this.emit = (event: string, info: any) => {
      EventCenter.emit(event, info);
    };
  }

  public componentWillUnmount() {
    this.observerList.forEach(observer => observer());
  }

  public render() {
    const { Cp, originProps } = this.props;
    return <Cp {...originProps} on={this.on} once={this.once} emit={this.emit} />;
  }
}

export default function EventWrapperDecorator<T extends React.ComponentClass | React.SFC>(
  Cp: T
): any {
  return (props: any) => <EventWrapper Cp={Cp} originProps={props} />;
}
