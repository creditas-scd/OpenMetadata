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

import { Card } from 'antd';
import { lowerCase } from 'lodash';
import React from 'react';

interface CardProps {
  description: string;
  id: string;
  heading?: string;
}

const CardV1 = ({ description, id, heading }: CardProps) => {
  return (
    <Card data-testid={`${lowerCase(id)}-summary-container`} size="small">
      {heading ? <h6 className="tw-heading tw-text-base">{heading}</h6> : ''}
      <div style={{ margin: '8px', textAlign: 'justify' }}>{description}</div>
    </Card>
  );
};

export default CardV1;
