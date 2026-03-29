import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css, token }) => {
    return css({
        '&.main-layout': {
            height: '100vh',
            background: token.colorBgLayout,
            overflow: 'hidden',

            '.main-layout-header': {
                zIndex: 100,
                flexShrink: 0,
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: `1px solid ${token.colorBorder}`,
                padding: '0 24px',
                height: 64,
                lineHeight: 'normal'
            },

            '.main-layout-brand': {
                display: 'flex',
                alignItems: 'center',
                gap: 12
            },

            '.main-layout-logo': {
                borderRadius: 11,
                background: `linear-gradient(135deg, ${token.colorPrimary}, #22d3ee)`,
                boxShadow: '0 2px 10px rgba(8, 145, 178, 0.25)',

                '& .anticon': {
                    color: '#fff',
                    fontSize: 18
                }
            },

            '.main-layout-title': {
                fontFamily: `'Figtree', 'Noto Sans', system-ui, sans-serif`,
                fontSize: 17,
                color: token.colorText,
                display: 'block',
                lineHeight: 1.2
            },

            '.main-layout-subtitle': {
                fontSize: 12,
                color: token.colorTextSecondary
            },

            '.main-layout-clearBtn': {
                borderRadius: 10,
                borderColor: token.colorBorder,
                color: token.colorTextSecondary,
                fontWeight: 500,
                transition: 'all 200ms ease',
                fontSize: 13,

                '&:hover, &:focus': {
                    borderColor: `${token.colorPrimary} !important`,
                    color: `${token.colorPrimary} !important`
                }
            },

            '.main-layout-footer': {
                flexShrink: 0,
                padding: '12px 24px 20px',
                background: token.colorBgLayout
            }
        }
    });
});

export default useStyles;
