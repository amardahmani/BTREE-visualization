import React, { useState } from 'react'
import * as d3 from 'd3';
import { useStore } from 'react-redux';
import { BTree } from '../structure/BTree';
import { Button, Input, Modal } from 'antd';
import { Box } from '@mui/material';

const openNotification = () => {
    
  };
  


  function getD3Tree(btree: any, path: any[] = []) {
    const tree = d3.tree().size([1000, 50 - 200]).separation(() => (38 * 2));
    let BTREE = btree.toHierarchy(btree.getRoot());
    
    // Update the hierarchy to mark nodes on the search path
    markNodesOnPath(BTREE, path);
  
    return tree(d3.hierarchy(BTREE));
  }
  
  function markNodesOnPath(node: any, path: any[]) {
  if (node.children) {
    node.children.forEach((child: any) => markNodesOnPath(child, path));
  }
  if (path.includes(node.data)) {
    node.highlighted = true;
  }
}
  
  export default function TreeVisualization() {
  
    let store = useStore();
  
    const [root, setRoot] = React.useState<any>(getD3Tree(store.getState().treeObject));
    const [searchResult, setSearchResult] = React.useState<any>(null);
    const [input, setInput] = React.useState<any>();
  
    const [alreadyInserted, setAlreadyInserted] = React.useState<any>([]);
    
    
    const settings = {
      keyCellWidth: 38,
      keyCellHeight: 28,
      linkStyles: {
        plain: {
          stroke: '#654321',
        },
        highlighted: {
          stroke: 'red',
        },
      },
      rectStyles: {
        plain: {
          fill: 'white',
          stroke: '#143b29',
          strokeWidth: 5,
        },
        highlighted: {
          fill: 'lightblue',
          stroke: 'red',
          strokeWidth: 2,
        },
      },
    };
  
    function nodes() {
      if (root) {
        const nodes = getNodes(root.descendants());
        return nodes;
      }
    };
  
    function links() {
      if (root) {
        const links = getLinks(root.descendants());
        return links;
      }
    };
  
    function getSVGParams(key: any, position: any, keys: any) {
      const isHighlighted = key.highlighted || (searchResult && key.text === searchResult);
      return {
        width: settings.keyCellWidth + (key.value.toString().length - 1) * 3,
        height: settings.keyCellHeight,
        x: position * (settings.keyCellWidth + (key.value.toString().length - 1) * 3)
          - ((settings.keyCellWidth + (key.value.toString().length - 1) * 3) / 2) * (keys ? keys.length : 2),
        y: -settings.keyCellHeight / 2,
        style: isHighlighted ? settings.rectStyles.highlighted : settings.rectStyles.plain,
      };
    };
  
    function getKeys(keys: any) {
      return keys.map((key: any, ii: any, keyArray: any) => (
        {
          text: key.value.toString(),
          position: ii,
          digits: key.value.toString().length,
          highlighted: key.highlighted,
          svgParams: getSVGParams(key, ii, keyArray),
        }
      )) || null;
    };
  
    function getNodes(descendants: any) {
      return descendants.map((d: any, i: any) => {
        const x = `${0 + d.x}px`;
        const y = `${20 - d.y}px`;
        return {
          id: i,
          keys: getKeys(d.data.leaves.keys),
          style: {
            transform: `translate(${x},${y})`,
          },
        };
      });
    };
    
    function getLinks(descendants: any) {
      return descendants.slice(1).map((d: any, i: any) => {
        const x = d.x + 0;
        const parentx = 0 + d.parent.x;
        const y = 20 - d.y;
        const parenty = 20 - d.parent.y;
        const highlighted = d.data.leaves.keys.some((key: any) => key.highlighted) && d.parent.data.leaves.keys.some((key: any) => key.highlighted);
        return {
          id: i,
          d: `M${x},${y}L${parentx},${parenty}`,
          style: highlighted ? settings.linkStyles.highlighted : settings.linkStyles.plain,
        };
      });
    };
  
  
    function printLinks(){
      const items = [];
  
      for (const link of links()) {
        items.push(<path className="link" strokeWidth="5" key={link.id} d={link.d} style={link.style}></path>)
      }
      return items
    }
  
    function printNode() {
      const items = [];
    
      for (const node of nodes()) {
        items.push(
          <g className="node" key={node.id}>
            {node.keys.map((key: any, index: any) => {
              const isHighlighted = node.highlighted && key.highlighted;
              
              console.log('isHighlighted:', isHighlighted); // Log isHighlighted value

              return (
                <g key={key.text} style={node.style}>
                  <rect
                    width={key.svgParams.width}
                    height={key.svgParams.height}
                    x={key.svgParams.x}
                    y={key.svgParams.y}
                    style={{
                      ...key.svgParams.style,
                      fill: isHighlighted ? 'red' : key.svgParams.style.fill,
                    }}
                  ></rect>
                  <text
                    dx={key.position * settings.keyCellWidth - (settings.keyCellWidth / 2) * (node.keys.length) + 10 - (key.digits - 2) * 4}
                    dy={4}
                    style={node.textStyle}
                  >
                    {key.text}
                  </text>
                </g>
              );
            })}
          </g>
        );
      }
    
      return items;
    }
    
  
    const handleInput = (e: any) => {
      let current;
    
      if (store.getState().dataType === 'number') {
        current = parseInt(e.target.value || 0, 10);
        if (Number.isNaN(current)) {
          return;
        }
      } else {
        // For strings, you can remove the previous restrictions
        current = e.target.value;
      }
    
      setInput(current);
    };
    const insertTree = () => {
      if(input === undefined) return;
      if(alreadyInserted.includes(input)){
        openNotification();
        return;
      }
      alreadyInserted.push(input);
      setAlreadyInserted(alreadyInserted);
      store.dispatch({
        type: 'INSERT_TREE',
        value: input,
      });
      setRoot(getD3Tree(store.getState().treeObject));
    }
    
    const searchTree = async () => {
      if (input === undefined) return;
    
      const valueToSearch = store.getState().dataType === 'number' ? parseInt(input, 10) : input;
      console.log("valueToSearch: " + valueToSearch);
    
      try {
        const { found, operations } = await store.getState().treeObject.searchWithOperations(valueToSearch);
    
        if (found) {
          // Display a modal with the information
          Modal.success({
            title: 'Node Found',
            content: `Node with value ${valueToSearch} found. Number of operations: ${operations}`,
          });
    
          setSearchResult(valueToSearch);
          setRoot(getD3Tree(store.getState().treeObject));
        } else {
          Modal.error(
            {
              title: 'value Not Found',
            }
          )
          setSearchResult(null); // Reset search result if not found
        }
      } catch (error) {
        
  
        console.error("Error in searchWithOperations:", error);
        // Handle the error as needed
      }
    };
    const deleteTree = () => {

    }
    return (
      <Box sx={{marginTop:"40px"}}>
          <Box sx={{display:"flex",flexDirection:"column",width:"10%"}}>
          <Input
            type="text"
            value={input}
            onChange={handleInput}
          />
          <Button onClick={insertTree}
          style={{marginTop:"10px"}}
          type='primary'>Insert</Button>
          <Button onClick={searchTree}
          style={{marginTop:"10px"}}
          type='default'>Search</Button>
          <Button onClick={deleteTree}
          style={{marginTop:"10px"}}
          type='primary' danger>Delete</Button>
        </Box>
          
        <svg
            className="svg"
            style={{
              width: `1000px`,
              height: `600px`
            }}
          >
            {printLinks()}
            {printNode()}
        </svg>
        </Box>
        
    );
  }