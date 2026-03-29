import { SendOutlined } from '@ant-design/icons';
import { Input, Button, Tooltip } from 'antd';
import { useState, memo } from 'react';
import useStyles from './styles';

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading?: boolean;
}

export const ChatInput = memo(function ChatInput({ onSend, isLoading }: ChatInputProps) {
    const [input, setInput] = useState('');
    const { styles, cx } = useStyles();

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSend(input.trim());
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={cx('chat-input', styles.toString())}>
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="请描述您的症状..."
                disabled={isLoading}
                size="large"
                variant="borderless"
                className={'chat-input-input'}
            />
            <Tooltip title="发送消息 (Enter)">
                <Button
                    color="primary"
                    variant="solid"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="large"
                    className={cx('chat-input-sendBtn', input.trim() && 'chat-input-sendBtnActive')}
                />
            </Tooltip>
        </div>
    );
});
