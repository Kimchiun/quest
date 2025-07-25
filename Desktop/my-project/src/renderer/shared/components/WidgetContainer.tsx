import React from 'react';
import styled from 'styled-components';
import Grid from './Grid';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

const Container = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  padding: 24px;
`;

interface WidgetContainerProps {
  widgets: React.ReactNode[];
  columns?: number;
  gap?: string;
  onReorder?: (widgets: React.ReactNode[]) => void;
}

const WidgetContainer: React.FC<WidgetContainerProps> = ({ widgets, columns = 4, gap = '24px', onReorder }) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(widgets);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    onReorder?.(reordered);
  };

  return (
    <Container>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widget-droppable" direction="horizontal">
          {(provided) => (
            <Grid columns={columns} gap={gap} ref={provided.innerRef} {...provided.droppableProps}>
              {widgets.map((w, i) => (
                <Draggable key={i} draggableId={String(i)} index={i}>
                  {(dragProvided, snapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      style={{
                        ...dragProvided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.5 : 1,
                        cursor: 'move',
                      }}
                    >
                      {w}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

export default WidgetContainer; 