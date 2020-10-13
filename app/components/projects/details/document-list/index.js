// @flow

import type { AsyncState } from "../../../../redux/redux.types.js";
import type { File } from "../../../../utils/models.types.js";
import React, { Component } from "react";
import { Linking, FlatList } from "react-native";
import { PitchDocumentVersionReadAll, OrganisationDocumentVersionReadAll } from "wri-api";
import DocumentCard from "../../../common/file-picker-view/card";
import Banner from "../../../common/banner";
import LoadingIndicator from "../../../common/loading-indicator";
import FileViewer from "react-native-file-viewer";
import { convertDocumentToFile } from "../../../../api/wri/helpers";

const documentsBannerIcon = require("../../../../assets/icons/profile/documents.png");

type DocumentStateTypes =
  | { type: "pitch", state: AsyncState<PitchDocumentVersionReadAll> }
  | { type: "organisation", state: AsyncState<OrganisationDocumentVersionReadAll> };

type Props = {|
  +style: any,
  +contentContainerStyle: any,

  /**
   * Document information displayed in the Documents tab
   */
  +documents: DocumentStateTypes,

  +scrollEnabled?: boolean,

  +translations: {|
    +empty: string
  |}
|};

export default class WriDocumentList extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  _handleDocumentPressed = (url: string) => {
    if (url.startsWith("file:/")) {
      //For some reason (unknown to developer), the url should not contain the prefix file:/
      FileViewer.open(url.replace("file:/", ""), { showOpenWithDialog: true });
    } else {
      Linking.openURL(url);
    }
  };

  render() {
    let documents: Array<File> = [];

    switch (this.props.documents.type) {
      case "pitch":
      case "organisation": {
        documents = (this.props.documents.state.data ?? []).map(version => convertDocumentToFile(version.data));
        break;
      }
      case "offer": {
        documents = (this.props.documents.state.data ?? []).map(doc => convertDocumentToFile(doc));
        break;
      }
    }

    const isFetching = this.props.documents.state.isFetching;

    return (
      <>
        {isFetching && <LoadingIndicator />}
        <FlatList
          style={this.props.style}
          contentContainerStyle={this.props.contentContainerStyle}
          data={documents}
          renderItem={({ item }) => (
            <DocumentCard document={item} onPress={item.uri ? () => this._handleDocumentPressed(item.uri) : null} />
          )}
          scrollEnabled={this.props.scrollEnabled}
          ListEmptyComponent={() => <Banner imageSource={documentsBannerIcon} header={this.props.translations.empty} />}
        />
      </>
    );
  }
}
