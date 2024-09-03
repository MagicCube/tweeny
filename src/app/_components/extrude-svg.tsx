'use client';

import React, {
  Children,
  type ReactElement,
  useMemo,
  type ReactNode,
} from 'react';
import ReactDOMServer from 'react-dom/server';

import { ShapeGeometry, type Shape, SVGLoader } from '~/three/core';
import { Extrude, type Vector3 } from '~/three/react';

export function ExtrudeSVG({
  children,
  depth = 50,
  position = [0, 0, 0],
}: {
  depth?: number;
  children?: ReactNode;
  position?: Vector3;
}) {
  const svgString = useMemo(() => {
    const svgElement = Children.toArray(children).find(
      (child) => (child as ReactElement).type === 'svg',
    );
    if (!svgElement) {
      throw new Error('SVG element not found in children');
    }
    return ReactDOMServer.renderToStaticMarkup(svgElement);
  }, [children]);
  const [shapes, offsetX, offsetY] = useMemo(() => {
    const shapes = svgToShapes(svgString);
    const boundingBox = getBoundingBoxOfShapes(shapes);
    const offsetX = -(boundingBox.max.x - boundingBox.min.x) / 2;
    const offsetY = -(boundingBox.max.y - boundingBox.min.y) / 2;
    return [shapes, offsetX, offsetY];
  }, [svgString]);
  const filteredChildren = useMemo(
    () =>
      Children.toArray(children).filter(
        (child) => (child as ReactElement).type !== 'svg',
      ),
    [children],
  );

  return (
    <group position={position}>
      <Extrude
        args={[
          shapes,
          {
            depth,
          },
        ]}
        position={[offsetX, offsetY, -depth / 2]}
      >
        {filteredChildren}
      </Extrude>
    </group>
  );
}

function svgToShapes(svgString: string): Shape[] {
  const svg = new SVGLoader().parse(svgString);
  const svgPath = svg.paths[0];
  if (!svgPath) {
    throw new Error('Invalid SVG');
  }
  return svgPath.toShapes(true);
}

function getBoundingBoxOfShapes(shapes: Shape[]) {
  const shapeGeometry = new ShapeGeometry(shapes);
  shapeGeometry.computeBoundingBox();
  return shapeGeometry.boundingBox!;
}
