import { ClearOutlined, HeartFilled } from '@ant-design/icons';
import { Layout, Typography, Button, Avatar, Tooltip } from 'antd';
import { ChatInput } from './components/ChatInput';
import { ChatWindow } from './components/ChatWindow';
import { useDiagnosisChat } from './hooks/useDiagnosisChat';
import useStyles from './styles';

const { Header, Content } = Layout;
const { Text } = Typography;

function App() {
    const { messages, status, error, sendMessage, confirmToolCall, clearChat } = useDiagnosisChat();
    const { styles, cx } = useStyles();

    const isLoading = status === 'submitted' || status === 'streaming';

    return (
        <Layout className={cx('main-layout', styles.toString())}>
            <Header className={'main-layout-header'}>
                <div className={'main-layout-brand'}>
                    <Avatar size={38} shape="square" className={'main-layout-logo'} icon={<HeartFilled />} />
                    <div>
                        <Text strong className={'main-layout-title'}>
                            AI 预问诊助手
                        </Text>
                        <Text className={'main-layout-subtitle'}>智能健康咨询</Text>
                    </div>
                </div>
                <Tooltip title="清空当前对话">
                    <Button icon={<ClearOutlined />} onClick={clearChat} className={'main-layout-clearBtn'}>
                        清空对话
                    </Button>
                </Tooltip>
            </Header>

            <div className={'main-layout-divider'} />

            <Content className={'main-layout-content'}>
                <ChatWindow messages={messages} status={status} error={error} onConfirmToolCall={confirmToolCall} />
            </Content>

            <div className={'main-layout-inputWrapper'}>
                <div className={'main-layout-inputInner'}>
                    <ChatInput onSend={sendMessage} isLoading={isLoading} />
                </div>
            </div>
        </Layout>
    );
}

export default App;
