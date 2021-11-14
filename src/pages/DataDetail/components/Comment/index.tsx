import React, { memo } from 'react';
import ExpendTable from './components/ExpendTable'

type IProps = {
  _id?: string;
};

export default memo((props: IProps) => {

  const { _id } = props;

  return (
    <ExpendTable 
      _id={_id!}
      source_type={"movie"}
      currentExpend={_id!}
    />
  );
});
