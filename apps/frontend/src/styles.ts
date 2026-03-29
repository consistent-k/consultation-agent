import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css, token }) => {
    return css({
        '&.main-layout': {
            minHeight: '100vh',
            background: token.colorBgLayout,

            '.main-layout-header': {
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: `1px solid ${token.colorBorder}`,
                padding: '0 24px',
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
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

            '.main-layout-divider': {
                height: 2,
                background: `linear-gradient(90deg, ${token.colorPrimary}, #22d3ee, #22c55e)`,
                opacity: 0.7
            },

            '.main-layout-content': {
                padding: '20px 16px 120px',
                maxWidth: 760,
                margin: '0 auto',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                flex: 1
            },

            '.main-layout-inputWrapper': {
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                background: `linear-gradient(180deg, transparent 0%, ${token.colorBgLayout} 25%)`,
                padding: '20px 16px 16px'
            },

            '.main-layout-inputInner': {
                maxWidth: 760,
                margin: '0 auto'
            }
        }
    });
});

export default useStyles;
