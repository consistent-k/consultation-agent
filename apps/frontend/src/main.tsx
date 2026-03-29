import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const theme = {
    token: {
        fontFamily: "'Figtree', 'Noto Sans', system-ui, sans-serif",
        colorPrimary: '#0891b2',
        colorSuccess: '#22c55e',
        colorInfo: '#06b6d4',
        colorText: '#134e4a',
        colorTextSecondary: '#5f9ea0',
        colorBgContainer: '#ffffff',
        colorBgLayout: '#f0fdfa',
        colorBorder: '#e2e8f0',
        colorBorderSecondary: '#f1f5f9',
        borderRadius: 12,
        borderRadiusLG: 16,
        borderRadiusSM: 8,
        controlHeight: 44,
        controlHeightLG: 48,
        controlHeightSM: 36,
        fontSize: 15,
        lineHeight: 1.6,
        wireframe: false
    },
    components: {
        Button: {
            primaryColor: '#ffffff',
            fontWeight: 600,
            primaryShadow: '0 2px 8px rgba(8, 145, 178, 0.3)'
        },
        Input: {
            activeBorderColor: '#0891b2',
            hoverBorderColor: '#06b6d4',
            activeShadow: '0 0 0 3px rgba(8, 145, 178, 0.12)'
        },
        Card: {
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
            boxShadowTertiary: '0 4px 12px rgba(8, 145, 178, 0.08)'
        },
        Tag: {
            defaultBg: '#f0fdfa',
            defaultColor: '#0891b2'
        },
        Avatar: {
            containerSizeSM: 32,
            containerSize: 36
        }
    }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ConfigProvider locale={zhCN} theme={theme}>
        <App />
    </ConfigProvider>
);
