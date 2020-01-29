import React from "react";
import { Classes, Tab2, Tabs2 } from "@blueprintjs/core";
import classnames from "classnames";
import { observer } from "mobx-react";
import appState from "../stores";
import SimpleSelect from "./utils/SimpleSelect";
import { addNode } from "../ipc/client";
import NodesPanel from "./panels/NodesPanel";
import LabelsPanel from "./panels/LabelsPanel";
import NodeDetail from "./panels/NodeDetailPanel";
import Legends from "./Legends";
import StatusBar from './StatusBar';

// TODO: migrate to simple select

@observer
class RenderOptionsCard extends React.Component {
  render() {
    return (
      <div
            className={classnames(
              Classes.CARD,
              Classes.ELEVATION_2,
              "overlay-card",
              "left-overlay-card",
              "transparent-frame"
            )}
          >
        <div>
          <h4>Graph Options</h4>
          <Tabs2 animate id="graph-options">
            <Tab2 id="nodes" title="Nodes" panel={<NodesPanel />} />
            <Tab2 id="labels" title="Labels" panel={<LabelsPanel />} />
            {/* <Tab2 id="layout" title="Layout" panel={<LayoutPanel />} /> */}
            <Tabs2.Expander />
          </Tabs2>
        </div>
      </div>
    );
  }
}

//

@observer
class FloatingCards extends React.Component {
  render() {
    return (
      <div className="floating-overlay">
        <div className="left-cards">
          {appState.search.panelOpen && (
            <div
              className={classnames(
                Classes.CARD,
                Classes.ELEVATION_2,
                "overlay-card",
                "left-overlay-card"
              )}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left"
                }}
              >
                <h4 style={{ width: 140 }}>
                  {appState.search.numCandidates} results
                </h4>
                <div style={{ width: 20 }} />
                <h4>Order</h4>
                <div style={{ width: 5 }} />
                <SimpleSelect
                  style={{ "margin-bottom": 10 }}
                  items={[...appState.graph.metadata.nodeComputed, "node_id"]}
                  onSelect={it => (appState.graph.searchOrder = it)}
                  value={appState.graph.searchOrder}
                />
              </div>
              <table
                className={classnames(
                  Classes.TABLE,
                  Classes.TABLE_STRIPED,
                  Classes.INTERACTIVE
                )}
                style={{
                  width: "100%",
                  userSelect: "none"
                }}
              >
                <tbody>
                  {appState.search.candidates.map((node, i) => (
                    <tr
                      key={i}
                      onMouseOver={() =>
                        appState.graph.frame.highlightNodeIds(
                          [node.node_id],
                          true
                        )
                      }
                      onMouseDown={() => addNode(node.node_id)}
                      onMouseLeave={() =>
                        appState.graph.frame.highlightNodeIds(
                          [node.node_id],
                          false
                        )
                      }
                    >
                      <td>{node[appState.graph.nodes.labelBy]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <center>
                <a
                  onMouseDown={() => {
                    if (appState.search.pageNum > 0) {
                      appState.search.pageNum -= 1;
                      appState.search.candidates = appState.search.allCands.slice(
                        appState.search.pageNum * appState.search.nPerPage,
                        (appState.search.pageNum + 1) * appState.search.nPerPage
                      );
                    }
                  }}
                >
                  Prev&nbsp;
                </a>
                &nbsp;
                {appState.search.pageNum !== 0 ? (
                  <a
                    onMouseDown={() => {
                      appState.search.pageNum = 0;
                      appState.search.candidates = appState.search.allCands.slice(
                        appState.search.pageNum * appState.search.nPerPage,
                        (appState.search.pageNum + 1) * appState.search.nPerPage
                      );
                    }}
                  >
                    1&nbsp;
                  </a>
                ) : (
                  <a
                    style={{
                      color: "#111111",
                      pointerEvents: "none",
                      cursor: "default"
                    }}
                  >
                    {appState.search.pageNum + 1}&nbsp;
                  </a>
                )}
                ...<b>&nbsp;</b>
                {appState.search.pages.map(i => {
                  if (
                    i != 0 &&
                    i != appState.search.maxPage &&
                    i == appState.search.pageNum
                  ) {
                    return (
                      <a
                        key={i}
                        style={{
                          color: "#111111",
                          pointerEvents: "none",
                          cursor: "default"
                        }}
                      >
                        {appState.search.pageNum + 1}&nbsp;
                      </a>
                    );
                  } else if (
                    i != 0 &&
                    i != appState.search.maxPage &&
                    ((i > appState.search.pageNum - 4 &&
                      i < appState.search.pageNum + 4) ||
                      (appState.search.pageNum < 4 && i < 8) ||
                      (appState.search.pageNum > appState.search.maxPage - 4 &&
                        i > appState.search.maxPage - 8))
                  ) {
                    return (
                      <a
                        key={i}
                        onMouseDown={() => {
                          appState.search.pageNum = i;
                          appState.search.candidates = appState.search.allCands.slice(
                            appState.search.pageNum * appState.search.nPerPage,
                            (appState.search.pageNum + 1) *
                              appState.search.nPerPage
                          );
                        }}
                      >
                        {i + 1}&nbsp;
                      </a>
                    );
                  }
                })}
                ...&nbsp;
                {appState.search.pageNum !== appState.search.maxPage ? (
                  <a
                    onMouseDown={() => {
                      appState.search.pageNum = appState.search.maxPage;
                      appState.search.candidates = appState.search.allCands.slice(
                        appState.search.pageNum * appState.search.nPerPage,
                        (appState.search.pageNum + 1) * appState.search.nPerPage
                      );
                    }}
                  >
                    {appState.search.maxPage + 1}&nbsp;
                  </a>
                ) : (
                  <a
                    style={{
                      color: "#111111",
                      pointerEvents: "none",
                      cursor: "default"
                    }}
                  >
                    {appState.search.pageNum + 1}
                  </a>
                )}
                &nbsp;
                <a
                  onMouseDown={() => {
                    if (appState.search.pageNum < appState.search.maxPage) {
                      appState.search.pageNum += 1;
                      appState.search.candidates = appState.search.allCands.slice(
                        appState.search.pageNum * appState.search.nPerPage,
                        (appState.search.pageNum + 1) * appState.search.nPerPage
                      );
                    }
                  }}
                >
                  Next
                </a>
                <br />
                <br />
                <h5>Page {appState.search.pageNum + 1}</h5>
              </center>
            </div>
          )}
          
          { appState.preferences.showGraphOption ? <RenderOptionsCard /> : null }
        </div>
        {appState.graph.selectedNodes.length === 1 && (
          <NodeDetail node={appState.graph.selectedNodes[0].data.ref} />
        )}
        <Legends />
        <StatusBar />
      </div>
    );
  }
}


export default FloatingCards;