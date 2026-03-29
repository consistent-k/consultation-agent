import { ClearOutlined, HeartFilled } from '@ant-design/icons';
import { Layout, Typography, Button, Avatar, Flex } from 'antd';
import { ChatInput } from '../../components/ChatInput';
import { ChatWindow } from '../../components/ChatWindow';
import { useDiagnosisChat } from '../../hooks/useDiagnosisChat';
import useStyles from './styles';

const { Header, Content } = Layout;
const { Text } = Typography;

const HomePage = () => {
    const { messages, status, error, sendMessage, confirmToolCall, clearChat } = useDiagnosisChat();
    const { styles, cx } = useStyles();

    const isLoading = status === 'submitted' || status === 'streaming';

    return (
        <Flex className={cx('main-layout', styles.toString())} vertical>
            <Flex className={'main-layout-header'} align="center" justify="space-between">
                <div className={'main-layout-brand'}>
                    <Avatar size={38} shape="square" className={'main-layout-logo'} icon={<HeartFilled />} />
                    <div>
                        <Text strong className={'main-layout-title'}>
                            AI 预问诊助手
                        </Text>
                        <Text className={'main-layout-subtitle'}>智能健康咨询</Text>
                    </div>
                </div>
                <Button icon={<ClearOutlined />} onClick={clearChat} className={'main-layout-clearBtn'}>
                    清空对话
                </Button>
            </Flex>

            <ChatWindow messages={messages} status={status} error={error} onConfirmToolCall={confirmToolCall} />

            <div className={'main-layout-footer'}>
                <ChatInput onSend={sendMessage} isLoading={isLoading} />
            </div>
        </Flex>
    );
};

export default HomePage;
