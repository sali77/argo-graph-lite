import React from "react";
import {
  Button,
  Classes,
  Card,
  Icon,
  Dialog,
  Intent,
  Spinner
} from "@blueprintjs/core";
import { observer } from "mobx-react";
import { toaster } from '../notifications/client';

import classnames from "classnames";
import appState from "../stores/index";
import { BACKEND_URL } from "../constants";

const uuidv4 = require('uuid/v4');

@observer
class ShareDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShared: false,
      isFetching: false,
      sharedURL: 'Error: Sharing failed'
    };

    this.handleRequest = this.handleRequest.bind(this);
  }

  async handleRequest(uuid) {
    // return await new Promise(resolve => setTimeout(resolve, 2000));
    const backendURL = `${BACKEND_URL}/snapshots`;
    // TODO: add better error handling
    return await fetch(backendURL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        referrer: 'no-referrer',
        body: JSON.stringify({
            uuid,
            body: window.saveSnapshotToString()
        }),
    }).then(response => response.ok).catch(error => {
        toaster.show({
            message: 'Failed to publish to sharing server. Unexpected error.',
            intent: Intent.DANGER,
            timeout: -1
        });
    });
  }

  render() {
    return (
        <Dialog
            iconName="projects"
            isOpen={appState.preferences.shareDialogOpen}
            onClose={() => {
            appState.preferences.shareDialogOpen = false;
            }}
            title={`Share Graph`}
        >
            <div className={classnames(Classes.DIALOG_BODY)}>
            {
                !this.state.isShared && (
                    <p>You can share the current state of your graph to a public URL that you can share with your friends! (*this will make your graph public)</p>
                )
            }
            {
                this.state.isFetching && (
                    <p><b>Sharing in progress. Please wait...</b></p>
                )
            }
            {
                this.state.isShared && (
                    <div>
                        Your graph has been shared to
                        <input id="snapshot-textarea" type="textarea" value={this.state.sharedURL} readOnly />
                        <button
                            onClick={() => {
                                document.getElementById('snapshot-textarea').select();
                                document.execCommand("copy");
                            }}
                        >
                            Copy to Clipboard
                        </button>
                    </div>
                )
            }
            </div>

            <div className={Classes.DIALOG_FOOTER}>
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    {
                        !this.state.isShared && (
                            <Button
                            className={classnames({
                                [Classes.DISABLED]: this.state.isFetching
                            })}
                            intent={Intent.PRIMARY}
                            onClick={async () => {
                                this.setState({ isFetching: true });
                                // Generate a random UUID
                                const uuid = uuidv4();
                                // Generate URL corresponding to the UUID
                                const sharedURL = `https://poloclub.github.io/argo-graph-lite/#${uuid}`;
        
                                // Wait for backend response
                                const requestSuccess = await this.handleRequest(uuid);
                                // Update local state
                                if (requestSuccess) {
                                    this.setState({ isFetching: false, isShared: true, sharedURL });
                                } else {
                                    // request fails, toast fires
                                    this.setState({ isFetching: false, isShared: false });
                                    toaster.show({
                                        message: 'Failed to publish to sharing server. Please try again later.',
                                        intent: Intent.DANGER,
                                        timeout: -1
                                    });
                                }
                                
                            }}
                            text="Share"
                            />
                        )
                    }
                    {
                        this.state.isShared && (
                            <Button
                            className={classnames({
                                [Classes.DISABLED]: this.state.isFetching
                            })}
                            intent={Intent.PRIMARY}
                            onClick={async () => {
                                this.setState({ isFetching: true, isShared: false });
                                // Generate a random UUID
                                const uuid = uuidv4();
                                // Generate URL corresponding to the UUID
                                const sharedURL = `https://poloclub.github.io/argo-graph-lite/#${uuid}`;
        
                                // Wait for backend response
                                const requestSuccess = await this.handleRequest(uuid);
                                // Update local state
                                if (requestSuccess) {
                                    this.setState({ isFetching: false, isShared: true, sharedURL });
                                } else {
                                    // request fails, toast fires
                                    this.setState({ isFetching: false, isShared: false });
                                    toaster.show({
                                        message: 'Failed to publish to sharing server. Please try again later.',
                                        intent: Intent.DANGER,
                                        timeout: -1
                                    });
                                }
                                
                            }}
                            text="Share Again to a new URL"
                            />
                        )
                    }
                    
                </div>
            </div>
        </Dialog>
    );
  }
}

export default ShareDialog;