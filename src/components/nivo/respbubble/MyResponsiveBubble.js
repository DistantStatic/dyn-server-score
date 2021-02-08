import { ResponsiveBubble } from '@nivo/circle-packing';

const myResponsiveBubbleHtml = (props) => {
    const d = props.data
    return (
        <ResponsiveBubble
            root={d}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            identity="name"
            value="amt"
            colors={{ scheme: props.chartCircleColors }}
            colorBy={props.chartCircleColorBy}
            padding={6}
            labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1 ] ] }}
            borderWidth={2}
            borderColor={{ from: 'color' }}
            defs={[
                {
                    id: 'lines',
                    type: 'patternDots',
                    background: 'none',
                    color: 'inherit',
                    rotation: -45,
                    lineWidth: 5,
                    spacing: 8
                }
            ]}
            fill={ props.chartCircleLines ? [ { match: { depth: 1 }, id: 'lines' } ] : []}
            animate={true}
            motionStiffness={80}
            motionDamping={12}
        />
    )
}

export default myResponsiveBubbleHtml;