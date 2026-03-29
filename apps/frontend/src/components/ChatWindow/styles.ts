import { createStyles, keyframes } from 'antd-style';

const gentlePulse = keyframes`
    0%, 100% {
        transform: scale(1);
        box-shadow:
            0 8px 32px rgba(8, 145, 178, 0.25),
            0 2px 8px rgba(8, 145, 178, 0.15);
    }
    50% {
        transform: scale(1.03);
        box-shadow:
            0 12px 40px rgba(8, 145, 178, 0.3),
            0 4px 12px rgba(8, 145, 178, 0.2);
    }
`;

const useStyles = createStyles(({ css, token }) => {
    return css({
        '&.chat-window': {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',

            '.chat-window-list': {
                flex: 1,
                overflowY: 'auto',
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                padding: '16px'
            },

            '.chat-window-loading': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 0',
                minHeight: 32
            },

            '.chat-window-loadingText': {
                fontSize: 13
            },

            '.chat-window-errorAlert': {
                marginBottom: 16
            },

            // Welcome screen
            '.chat-window-welcomeScreen': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '55vh',
                textAlign: 'center',
                padding: '40px 20px'
            },

            '.chat-window-welcomeAvatarWrap': {
                '& > .ant-avatar': {
                    animation: `${gentlePulse} 3s ease-in-out infinite`
                }
            },

            '.chat-window-welcomeAvatar': {
                borderRadius: 20,
                background: 'linear-gradient(135deg, #0891b2, #22d3ee)',
                boxShadow: '0 8px 32px rgba(8, 145, 178, 0.25), 0 2px 8px rgba(8, 145, 178, 0.15)',

                '.anticon': {
                    color: '#fff',
                    fontSize: 32
                }
            },

            '.chat-window-welcomeTitle': {
                fontSize: 22,
                color: '#134e4a',
                marginTop: 20,
                marginBottom: 8,
                display: 'block',
                fontFamily: "'Figtree', 'Noto Sans', system-ui, sans-serif"
            },

            '.chat-window-welcomeDesc': {
                fontSize: 15,
                color: '#5f9ea0',
                maxWidth: 400,
                lineHeight: 1.6,
                display: 'block',
                marginBottom: 28
            },

            '.chat-window-welcomeCards': {
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                justifyContent: 'center',
                maxWidth: 500
            },

            '.chat-window-welcomeCard': {
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '14px 16px',
                width: 150,
                textAlign: 'center',
                transition: 'all 250ms ease',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
                cursor: 'default',

                '&:hover': {
                    borderColor: '#0891b2',
                    boxShadow: '0 4px 16px rgba(8, 145, 178, 0.12)',
                    transform: 'translateY(-2px)'
                }
            },

            '.chat-window-welcomeCardIcon': {
                background: 'rgba(8, 145, 178, 0.08)',
                color: '#0891b2',
                marginBottom: 8
            },

            '.chat-window-welcomeCardLabel': {
                fontSize: 14,
                color: '#134e4a',
                display: 'block'
            },

            '.chat-window-welcomeCardDesc': {
                fontSize: 12,
                color: '#94a3b8',
                display: 'block',
                marginTop: 2
            },

            '.chat-window-userAvatar': {
                background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
                boxShadow: '0 2px 8px rgba(8, 145, 178, 0.2)',
                flexShrink: 0
            },

            '.chat-window-assistantAvatar': {
                background: '#ffffff',
                border: '2px solid #e2e8f0',
                color: '#0891b2',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
                flexShrink: 0
            },

            '.chat-window-bubbleContent': {
                flex: 1,
                minWidth: 0
            },

            // Tool output
            '.chat-window-toolOutput': {
                marginTop: 8,
                marginBottom: 8,
                padding: '8px 12px',
                background: '#f0fdf4',
                borderRadius: 8,
                border: '1px solid #bbf7d0'
            },

            '.chat-window-toolOutputText': {
                fontSize: 13,
                color: '#16a34a',
                fontWeight: 500
            },

            '.chat-window-loadingSpin': {
                color: '#94a3b8'
            },

            // ThoughtChain styles
            '.chat-window-thoughtChain': {
                width: '100%'
            },

            '.chat-window-stepContent': {
                display: 'flex',
                flexDirection: 'column',
                gap: 8
            }
        }
    });
});

export default useStyles;
