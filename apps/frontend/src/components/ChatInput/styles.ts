import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css }) => {
    return css({
        '&.chat-input': {
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            background: '#ffffff',
            borderRadius: 16,
            border: '1px solid #e2e8f0',
            padding: '6px 6px 6px 18px',
            boxShadow: '0 4px 20px rgba(8, 145, 178, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
            transition: 'border-color 250ms ease, box-shadow 250ms ease',

            '.chat-input-input': {
                flex: 1,
                fontSize: 15,
                fontFamily: "'Noto Sans', sans-serif"
            },

            '.chat-input-sendBtn': {
                borderRadius: 12,
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 250ms ease'
            },

            '.chat-input-sendBtnActive': {
                background: 'linear-gradient(135deg, #0891b2, #06b6d4) !important',
                boxShadow: '0 2px 8px rgba(8, 145, 178, 0.3) !important'
            }
        }
    });
});

export default useStyles;
