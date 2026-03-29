import { RefObject, useCallback, useEffect, useState } from 'react';

const SCROLL_THRESHOLD = 10;

const useScrollToBottom = (scrollRef: RefObject<HTMLDivElement | null>, detach: boolean = false) => {
    const [autoScroll, setAutoScroll] = useState(true);

    const isAtBottom = useCallback(() => {
        const dom = scrollRef.current;
        if (!dom) return true;
        return dom.scrollHeight - dom.scrollTop - dom.clientHeight < SCROLL_THRESHOLD;
    }, [scrollRef]);

    function scrollDomToBottom() {
        const dom = scrollRef.current;
        if (dom) {
            requestAnimationFrame(() => {
                dom.scrollTo({ top: dom.scrollHeight, behavior: 'smooth' });
            });
        }
    }

    // listen for manual scroll
    useEffect(() => {
        const dom = scrollRef.current;
        if (!dom) return;

        const handleScroll = () => {
            setAutoScroll(isAtBottom());
        };

        dom.addEventListener('scroll', handleScroll, { passive: true });
        return () => dom.removeEventListener('scroll', handleScroll);
    }, [scrollRef, isAtBottom]);

    // auto scroll on new content
    useEffect(() => {
        if (autoScroll && !detach) {
            scrollDomToBottom();
        }
    });

    return {
        scrollRef,
        autoScroll,
        setAutoScroll,
        scrollDomToBottom
    };
};

export default useScrollToBottom;
