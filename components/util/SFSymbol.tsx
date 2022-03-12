/**
 * From OSS library https://github.com/birkir/react-native-sfsymbols
 */

import React from 'react';

import {
  requireNativeComponent,
  processColor,
  StyleProp,
  ViewStyle,
  ProcessedColorValue,
  ColorValue,
} from 'react-native';

export enum SFSymbolWeight {
  ULTRALIGHT = 'ultralight',
  LIGHT = 'light',
  THIN = 'thin',
  REGULAR = 'regular',
  MEDIUM = 'medium',
  SEMIBOLD = 'semibold',
  BOLD = 'bold',
  HEAVY = 'heavy',
}

export enum SFSymbolScale {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export type SymbolWeight =
  | 'ultralight'
  | 'light'
  | 'thin'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'heavy';

export type SymbolScale = 'small' | 'medium' | 'large';

export type SymbolResizeMode =
  | 'scale-to-fill'
  | 'scale-aspect-fit'
  | 'scale-aspect-fill'
  | 'redraw'
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'cover'
  | 'contain'
  | 'stretch';

export interface SFSymbolProps {
  name: string;
  color?: ColorValue;
  style?: StyleProp<ViewStyle>;
  size?: number;
  resizeMode?: SymbolResizeMode;
  weight?: SymbolWeight;
  scale?: SymbolScale;
  multicolor?: boolean;
}

type NativeSFSymbolProps = Omit<SFSymbolProps, 'color' | 'name'> & {
  iconColor?: ProcessedColorValue | null;
  systemName: string;
};

const RNSFSymbol = requireNativeComponent<NativeSFSymbolProps>('RNSfsymbols');

export class SFSymbol extends React.PureComponent<SFSymbolProps> {
  render() {
    const {name, color, resizeMode, ...props} = this.props;
    const defaultResizeMode =
      !resizeMode && props.size ? 'center' : 'scale-aspect-fit';

    return (
      <RNSFSymbol
        {...props}
        resizeMode={resizeMode ?? defaultResizeMode}
        systemName={name}
        iconColor={processColor(color)}
      />
    );
  }
}
