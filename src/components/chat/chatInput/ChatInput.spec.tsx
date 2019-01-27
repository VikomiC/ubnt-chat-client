import { mount } from "enzyme";
import * as React from "react";

import { ChatInput } from "./ChatInput";

describe("components/chat/chatInput/ChatInput", () => {
    it("should match snapshot for ChatInput", () => {
        const component = mount(<ChatInput onChatMessageEnter={() => {/*noop*/}} />);
        expect(component).toMatchSnapshot();
    });
});
