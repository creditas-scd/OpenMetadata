/*
 *  Copyright 2022 Collate
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { findByTestId, findByText, render } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { getWebhooks } from '../../axiosAPIs/webhookAPI';
import { SlackSettingsPage } from './SlackSettingsPage.component';

jest.mock('../../components/containers/PageContainerV1', () => {
  return jest
    .fn()
    .mockImplementation(({ children }: { children: ReactNode }) => (
      <div data-testid="PageContainerV1">{children}</div>
    ));
});

jest.mock('../../components/Webhooks/WebhooksV1', () => {
  return jest.fn().mockImplementation(() => <>testWebhookV1</>);
});

jest.mock('../../axiosAPIs/webhookAPI.ts', () => ({
  getWebhooks: jest.fn().mockImplementation(() => Promise.resolve()),
}));

describe('Test SlackSettings page Component', () => {
  it('should load WebhookV1 component on API success', async () => {
    const { container } = render(<SlackSettingsPage />, {
      wrapper: MemoryRouter,
    });
    const PageContainerV1 = await findByTestId(container, 'PageContainerV1');
    const webhookComponent = await findByText(container, /testWebhookV1/);

    expect(PageContainerV1).toBeInTheDocument();
    expect(webhookComponent).toBeInTheDocument();
    expect(getWebhooks).toBeCalledTimes(1);
  });
});
