import React from 'react';
import { useStore } from 'react-redux';
import { Button, Select, Steps, notification } from 'antd';
import { Box } from '@mui/material';
const { Step } = Steps;
const { Option } = Select;
const steps = [
  {
    title: 'Btree',
  },
  {
    title: 'Data type',
  },
  {
    title: 'Max degree',
  },
];
const openNotification = () => {
    notification.open({
      message: 'Notification',
      description:
        'Please select a option',
    });
  };
  

export default function Banner() {

    let store = useStore();

    const [isStepper,  setIsStepper] = React.useState(false);
    const [current, setCurrent] = React.useState(0);

    function handleContinue(){
      setIsStepper(true);
    }

    function handleTreeType (value : any) {
        store.dispatch({
            type: 'SET_TREE_TYPE',
            text: value,
        });
    }

    function nextTreeType() {
      let check = store.getState();
      if(check.treeType !== ''){
        setCurrent(current+1);
      }else{
        openNotification()
      }
    }

    function handleDataType (value : any) {
        store.dispatch({
            type: 'SET_DATA_TYPE',
            text: value,
        });
    }
    function nextDataType() {
      let check = store.getState();
      if(check.dataType !== ''){
        setCurrent(current+1);
      }else{
        openNotification()
      }
    }

    function handleMaxDegree (value : any) {
        store.dispatch({
            type: 'SET_MAX_DEGREE',
            text: value,
        });
    }

    function nextMaxDegree() {
      let check = store.getState();
      if(check.maxDegree !== ''){
        if(check.treeType === 'btree'){
          store.dispatch({
            type: 'CREATE_BTREE_OBJECT',
            dataType: check.dataType,
            maxDegree: check.maxDegree,
          });
        }
        
        store.dispatch({
          type: 'SET_VIEW_TREE',
          text: true,
        });
      }else{
        openNotification()
      }
    }

  return (
    <Box sx={{margin:"10px auto"}} display="flex" alignItems="center" justifyContent="center">
      <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",marginTop:"30px"}}>
        {
          isStepper ?
          <div className="card-wrapper">
            <Steps current={current}>
              {steps.map(item => (
                <Step key={item.title} title={item.title} />
              ))}
            </Steps>
            {current === 0 ?
            <Box sx={{display:"flex",flexDirection:"column"}}>
              <h2>CHOOSE YOUR BTREE</h2>
              <Select
                  key="2"
                  showSearch
                  size='large'
                  onChange={handleTreeType}
              >
                  <Option value="btree">B Tree</Option>
              </Select>
              <Button style={{marginTop: '20px'}} onClick={nextTreeType}
              size='large'
              type='primary'>Next</Button>
            </Box> : null}
            {current === 1 ?
            <Box sx={{display:"flex",flexDirection:"column"}}>
              <h2 key="3">CHOOSE YOUR DATA TYPE</h2>
              <Select
                  key="4"
                  showSearch
                  size='large'
                  onChange={handleDataType}
              >
                  <Option value="number">Number</Option>
                  <Option value="string">String</Option>
              </Select>
              <Button style={{marginTop: '20px'}} onClick={nextDataType}
              size='large'
              type='primary'>Next</Button>
            </Box> : null}
            {current === 2 ?
            <div className="steps-content">
              <h2 key="5">CHOOSE YOUR MAX DEGREE</h2>
              <Select
                  key="6"
                  showSearch
                  style={{ width: "100%" }}
                  onChange={handleMaxDegree}
              >
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                  <Option value="5">5</Option>
              </Select>
              <Button style={{marginTop: '20px'}} onClick={nextMaxDegree} 
              size='large'
              type='primary'>Create tree</Button>
            </div> : null}
          </div>
          :
          <div>
           
              <Button key="continue" onClick={handleContinue} size='large'>Start</Button>
            
          </div>
        }
      </Box>
    </Box>
  );
}