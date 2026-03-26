import { Box, Card, CardContent, CardHeader as CardHeaderBase, IconButton, styled, Typography } from '@mui/material'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import React from 'react'
import { useAppContext } from '../../context/AppContext';
import { MODE_LAYOUT } from '../../context/layouts/constants';
import { TABLET_STATUS } from '../../helpers/const/constOverview';

const CardHeader = styled(CardHeaderBase,{
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !=='colorState'
})(({theme, isSelected, colorState  })=>({
  backgroundColor:( colorState !== '' ? colorState : isSelected ? '#404046' : '#D4D5DB'),
  padding:0,
  //background: '#D4D5DB 0% 0% no-repeat padding-box',
  borderRadius: '4px 4px 0px 0px',
  opacity: 1,
  height:'31px',
  [theme.breakpoints.down('xl')]:{
    height:'100%',
    paddingTop:'2px',
    paddingBottom:'2px'
  },
  '& .MuiCardHeader-content':{
    flex:0,
    height:'100%',
  },
  '& .MuiCardHeader-action':{
    width:'100%',
    //justifyItems:'stretch',
    height:'100%',
    margin:0
  },
  //borderBottom: '1px dashed gray'
}))

const ContentTable = ({isAdd=false,  isDelete, onClickDelete, dinersQuantity, children, colorState = '', table, isOverview = false}) => {
  const {layouts: layoutsContext, overview: overviewContext} = useAppContext()
  const { selectedTable, mode } = layoutsContext;
  const { tabletStatus } = overviewContext;

  
  const isSelected = selectedTable?.id ? selectedTable && table.id === selectedTable?.id : false;
  
  const isCombination = selectedTable?.table_combination ? selectedTable.table_combination.includes(table.id) : false

  const isNewTable = isAdd && table.id !== selectedTable?.id

  const colorTextAndIcon = isSelected || isCombination || isNewTable || (colorState !== '' && table?.table_status === TABLET_STATUS.RESERVED ) ? 'white' : '#404046'

  const hasOpacity = (isOverview && colorState === '')  || (!isAdd && MODE_LAYOUT.TABLE_ADD === mode)

  return (
    <Card  sx={{borderRadius:'8px',  opacity: hasOpacity && 0.3}}>
      {!isOverview && 
      <CardHeader
        isSelected={isSelected || isCombination || isNewTable}
        colorState={colorState}
        action={
          <Box sx={{display:'flex', pl:'2px', pr:'5px', width:'100%', height:'100%', alignItems:'center', justifyContent:'space-between'}}>
            <Box ml={0.5} display={'flex'} alignItems={'center'}>
              <PeopleAltOutlinedIcon sx={{fontSize:'14px', color: colorTextAndIcon}}/>
              <Typography fontSize={'12px'} ml={'6px'} color= {colorTextAndIcon}>{dinersQuantity}</Typography>   
            </Box>
          {isDelete && 
              <IconButton sx={{padding:0, mr:1, ml:0.5}} onClick={onClickDelete} aria-label="settings">
                {isDelete && <CancelSharpIcon sx={{fill:'white', fontSize:'15px'}}/> }
              </IconButton>}
          </Box>
        }
      /> }
    <CardContent 
      sx={{':last-child':{
          paddingBottom: 'initial',
        },
        padding:'0px',
        display:'flex',
        justifyContent:'center',
        p:'4%',
        border: isOverview ? '1px solid #D4D5DB' : isSelected ? '1px solid #404046' : (isNewTable || isCombination) && '1px dashed #404046',
        borderRadius:isOverview && '8px',
        borderBottomLeftRadius:'8px',
        borderBottomRightRadius:'8px',
      }}
      >
        {children}
      </CardContent>
    </Card>
  )
}

export default ContentTable