import { SelectionTool } from "./selection-tool";
import { DrawingTool } from "./drawing-tool";
import { UndoTool, RedoTool } from "./undo-redo-tool";

export type Props = {};

export const DrawingToolbar = () => {
  return (
    <>
      <SelectionTool />
      <DrawingTool />
      <UndoTool />
      <RedoTool />
    </>
  );
};
