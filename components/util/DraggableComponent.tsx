import React, {ReactNode, useEffect, useRef, useState} from "react";
import {Animated, View, PanResponder, LayoutRectangle} from "react-native";

export default function DraggableComponent(props: {
    disableX?: boolean,
    disableY?: boolean,
    posListener?: (layout: LayoutRectangle) => void,
    stopDragging?: (layout: LayoutRectangle) => {x: number, y: number} | void,
    offsetX?: Animated.Value,
    offsetY?: Animated.Value,
    children: ReactNode[]|ReactNode,
}) {
    const size = useRef({x: 0, y: 0, width: 0, height: 0});

    const position =
        useRef(new Animated.ValueXY()).current;

    useEffect(() => {
        position.removeAllListeners();

        position.addListener(({x, y}) => {
            size.current = {...size.current, x, y};

            props.posListener?.(size.current)
        });
    }, [props.posListener]);

    const scrollStart = useRef(-1);

    const isActive = () => scrollStart.current != -1 && Date.now() - scrollStart.current > 250
    const [active, setActive] = useState(false);
    if (!active) position.setValue({x: 0, y: 0});

    const panResponder = useRef(PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onShouldBlockNativeResponder: isActive,
        onPanResponderMove: (e, {dx, dy}) => {
            if (isActive()) {
                setActive(true);
                position.setValue({ x: dx, y: dy });
            } else {
                setActive(false);
                scrollStart.current = -1;
            }
        },
        onPanResponderRelease: () => {
            const pos = props.stopDragging?.(size.current)
            pos && position.setValue(pos);

            setActive(false);
            scrollStart.current = -1;
        },
    })).current;

    const transform = []
    !props.disableX && transform.push({translateX: position.x});
    !props.disableY && transform.push({translateY: position.y});
    props.offsetX && transform.push({translateX: props.offsetX});
    props.offsetY && transform.push({translateY: props.offsetY});

    return (
        <Animated.View
            onTouchStart={() => scrollStart.current = Date.now()}
            {...panResponder.panHandlers}
            style={[
                {
                    transform,
                    opacity: active ? 0.65 : undefined,
                },
            ]}
            onLayout={evt => {
                const {width, height} = evt.nativeEvent.layout;
                size.current = {...size.current, width, height};
            }}
        >
            {props.children}
        </Animated.View>
    )
}