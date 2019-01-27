import { mount } from "enzyme";
import * as React from "react";

import { Action, Message, User } from "../../../model";
import { ChatList } from "./ChatList";

describe("components/chat/chatList/ChatList", () => {
    it("should match snapshot for ChatList", () => {
        const user: User = {
            avatar: "url",
            id: 123,
            nickname: "nickname",
        };
        const user2: User = {
            avatar: "url2",
            id: 1234,
            nickname: "nickname111",
        };
        const messages: Message[] = [
            {
                action: Action.JOINED,
                from: user,
                id: 123,
            },
            {
                content: "Hi",
                from: user,
                id: 124,
            },
            {
                content: "Hello",
                from: user2,
                id: 125,
            },
            {
                action: Action.LEFT,
                from: user2,
                id: 126,
            },
        ];
        const component = mount(<ChatList user={user} messages={messages} />);
        expect(component).toMatchSnapshot();
    });
});
