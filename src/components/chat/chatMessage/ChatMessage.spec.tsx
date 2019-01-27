import { mount } from "enzyme";
import * as React from "react";

import { Action, Message, User } from "../../../model";
import { ChatMessage } from "./ChatMessage";

describe("components/chat/chatMessage/ChatMessage", () => {
    const user: User = {
        avatar: "url",
        id: 123,
        nickname: "nickname",
    };

    it("should not render component when `from` is empty", () => {
        const message: Message = {
            content: "Hacked message",
            id: 1,
        };
        const component = mount(<ChatMessage user={user} message={message}/>);
        expect(component.html()).toBe(null);
    });

    it("should match snapshot when message is from current user", () => {
        const message: Message = {
            content: "Current user message",
            from: user,
            id: 1,
        };
        const component = mount(<ChatMessage user={user} message={message}/>);
        expect(component).toMatchSnapshot();
    });

    it("should match snapshot when message is from other user", () => {
        const user2: User = {
            avatar: "url2",
            id: 1234,
            nickname: "nickname111",
        };
        const message: Message = {
            content: "Other user message",
            from: user2,
            id: 1,
        };
        const component = mount(<ChatMessage user={user} message={message}/>);
        expect(component).toMatchSnapshot();
    });

    it("should match snapshot when user joined", () => {
        const message: Message = {
            action: Action.JOINED,
            from: user,
            id: 1,
        };
        const component = mount(<ChatMessage user={user} message={message}/>);
        expect(component).toMatchSnapshot();
    });

    it("should match snapshot when user renamed", () => {
        const message: Message = {
            action: Action.RENAME,
            content: {
                nickname: user.nickname,
                previousNickname: "bla-bla-bla",
            },
            from: user,
            id: 1,
        };
        const component = mount(<ChatMessage user={user} message={message}/>);
        expect(component).toMatchSnapshot();
    });

    it("should match snapshot when user joined", () => {
        const message: Message = {
            action: Action.LEFT,
            from: user,
            id: 1,
        };
        const component = mount(<ChatMessage user={user} message={message}/>);
        expect(component).toMatchSnapshot();
    });

    it("should match snapshot when user renamed", () => {
        const message: Message = {
            action: Action.KICKOUT,
            from: user,
            id: 1,
        };
        const component = mount(<ChatMessage user={user} message={message}/>);
        expect(component).toMatchSnapshot();
    });
});
