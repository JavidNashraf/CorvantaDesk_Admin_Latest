import React, { useState } from "react";
import { EditorState } from "draft-js";
import { CustomEditor } from "components";
import { DashboardLayout } from "layout";
import "./Editor.styles.scss";

function EditorPage() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (state) => {
    setEditorState(state);
    // console.log(state);
  };

  return (
    <DashboardLayout>
      <div className="ep">
        <h1 className="ep__heading">WYSIWYG Editor</h1>
        <div className="ep__container">
          <CustomEditor
            editorState={editorState}
            wrapperClassName="ep__container-wrapper"
            editorClassName="ep__container-editor"
            onChange={onEditorStateChange}
            placeholder="Start typing here..."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EditorPage;
