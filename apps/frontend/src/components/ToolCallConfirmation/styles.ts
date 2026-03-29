import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => {
    return css({
        '&.tool-call-confirmation': {
            margin: '10px 0',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            boxShadow: '0 1px 4px rgba(8, 145, 178, 0.06)',
            overflow: 'hidden',

            '.tool-call-confirmation-header': {
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 8
            },

            '.tool-call-confirmation-iconWrapper': {
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'rgba(8, 145, 178, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                '.anticon': {
                    color: '#0891b2',
                    fontSize: 14
                }
            },

            '.tool-call-confirmation-headerTag': {
                margin: 0,
                borderRadius: 6,
                fontWeight: 500,
                fontSize: 13,
                padding: '2px 10px'
            },

            '.tool-call-confirmation-question': {
                fontSize: 15,
                color: '#134e4a',
                lineHeight: 1.6,
                padding: '6px 0',
                borderLeft: '3px solid #22d3ee',
                paddingLeft: 12,
                marginLeft: 2
            },

            '.tool-call-confirmation-inputSection': {
                marginTop: 10
            },

            '.tool-call-confirmation-inputLabel': {
                fontSize: 13,
                color: '#94a3b8',
                display: 'block',
                marginBottom: 6
            },

            '.tool-call-confirmation-durationInput': {
                maxWidth: 280
            },

            '.tool-call-confirmation-tags': {
                marginTop: 8,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6
            },

            '.tool-call-confirmation-tag': {
                borderRadius: 6,
                padding: '2px 10px',
                fontSize: 13
            },

            '.tool-call-confirmation-confirmActions': {
                marginTop: 14,
                display: 'flex',
                gap: 8
            },

            '.tool-call-confirmation-confirmBtnActive': {
                background: 'linear-gradient(135deg, #0891b2, #06b6d4) !important',
                border: 'none !important',
                boxShadow: '0 2px 8px rgba(8, 145, 178, 0.25) !important'
            },

            // Report
            '.tool-call-confirmation-reportCard': {
                background: '#f0fdfa',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '10px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
            },

            '.tool-call-confirmation-reportItem': {
                display: 'flex',
                gap: 8,
                fontSize: 14,
                lineHeight: 1.6
            },

            '.tool-call-confirmation-reportLabel': {
                color: '#5f9ea0',
                flexShrink: 0,
                width: 64
            },

            '.tool-call-confirmation-reportValue': {
                color: '#134e4a'
            },

            '.tool-call-confirmation-reportDivider': {
                marginTop: 4,
                paddingTop: 6,
                borderTop: '1px solid #e2e8f0'
            },

            '.tool-call-confirmation-reportSummaryLabel': {
                fontSize: 13,
                color: '#94a3b8',
                display: 'block',
                marginBottom: 2
            },

            '.tool-call-confirmation-reportSummaryText': {
                color: '#134e4a',
                fontSize: 14
            },

            '.tool-call-confirmation-reportLabelFull': {
                fontSize: 13,
                color: '#94a3b8',
                display: 'block',
                marginBottom: 8
            }
        }
    });
});

export default useStyles;
