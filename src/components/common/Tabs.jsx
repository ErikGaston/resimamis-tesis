import React from 'react'
import PropTypes from 'prop-types'
import { Box, Tab, Tabs as TabsBase, Typography } from '@mui/material'

const Tabs = ({
  onChange = () => {},
  value = null,
  tabs = [],
  variant = 'standard'
}) => {

  const [dataValue, setDataValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setDataValue(newValue);
  };

  return (
      tabs && tabs.length > 0 &&
        <>
          <Box className='containerTabs' sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabsBase value={value ? value : dataValue} variant={variant} onChange={onChange ? onChange : handleChange} aria-label="basic tabs example">
              {tabs.map((tab, i) =>(
                <Tab key={tab.value} sx={{ml:1,mr:1}} label={tab.title} value={tab.value ? tab.value : i} {...a11yProps(i)} />
              ))}
            </TabsBase>
          </Box>
          {tabs.map((tab, i) =>{
            if(tabs.showPanel){
              return (
              <TabPanel key={tab.value} value={value ? value : dataValue} index={i}>
                  {tab.content}
              </TabPanel>
            )}
          })}
      </>
  )
}

export default Tabs


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}