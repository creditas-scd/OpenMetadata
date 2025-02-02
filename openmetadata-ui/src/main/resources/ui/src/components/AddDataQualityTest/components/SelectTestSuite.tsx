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

import {
  Button,
  Divider,
  Form,
  FormProps,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { AxiosError } from 'axios';
import { isEmpty } from 'lodash';
import { EditorContentRef } from 'Models';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getListTestSuites } from '../../../axiosAPIs/testAPI';
import {
  API_RES_MAX_SIZE,
  getTableTabPath,
} from '../../../constants/constants';
import { TestSuite } from '../../../generated/tests/testSuite';
import SVGIcons, { Icons } from '../../../utils/SvgUtils';
import { showErrorToast } from '../../../utils/ToastUtils';
import RichTextEditor from '../../common/rich-text-editor/RichTextEditor';
import {
  SelectTestSuiteProps,
  SelectTestSuiteType,
} from '../AddDataQualityTest.interface';

const SelectTestSuite: React.FC<SelectTestSuiteProps> = ({
  onSubmit,
  initialValue,
}) => {
  const { entityTypeFQN } = useParams<Record<string, string>>();
  const history = useHistory();
  const [isNewTestSuite, setIsNewTestSuite] = useState(
    initialValue?.isNewTestSuite ?? false
  );
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const markdownRef = useRef<EditorContentRef>();

  const fetchAllTestSuite = async () => {
    try {
      const { data } = await getListTestSuites({
        limit: API_RES_MAX_SIZE,
      });

      setTestSuites(data);
    } catch (error) {
      showErrorToast(error as AxiosError);
    }
  };

  const getDescription = () => {
    return markdownRef.current?.getEditorContent() || '';
  };

  const handleCancelClick = () => {
    history.push(getTableTabPath(entityTypeFQN));
  };

  const handleFormSubmit: FormProps['onFinish'] = (value) => {
    const data: SelectTestSuiteType = {
      name: value.testSuiteName,
      description: getDescription(),
      data: testSuites.find((suite) => suite.id === value.testSuiteId),
      isNewTestSuite,
    };

    onSubmit(data);
  };

  useEffect(() => {
    if (testSuites.length === 0) {
      fetchAllTestSuite();
    }
  }, []);

  return (
    <Form
      initialValues={{
        testSuiteId: initialValue?.data?.id,
        testSuiteName: initialValue?.name,
      }}
      layout="vertical"
      name="selectTestSuite"
      onFinish={handleFormSubmit}>
      <Form.Item
        label="Test Suite:"
        name="testSuiteId"
        rules={[
          { required: !isNewTestSuite, message: 'Test suite is required' },
        ]}>
        <Select
          disabled={isNewTestSuite}
          options={testSuites.map((suite) => ({
            label: suite.name,
            value: suite.id,
          }))}
          placeholder="Select test suite"
        />
      </Form.Item>
      <Divider plain>OR</Divider>

      {isNewTestSuite ? (
        <>
          <Typography.Paragraph className="tw-text-base tw-mt-5">
            New Test Suite
          </Typography.Paragraph>
          <Form.Item
            label="Name:"
            name="testSuiteName"
            rules={[
              {
                required: isNewTestSuite,
                message: 'Name is required!',
              },
              {
                validator: (_, value) => {
                  if (testSuites.some((suite) => suite.name === value)) {
                    return Promise.reject('Name already exist!');
                  }

                  return Promise.resolve();
                },
              },
            ]}>
            <Input placeholder="Enter test suite name" />
          </Form.Item>
          <Form.Item
            label="Description:"
            name="description"
            rules={[
              {
                required: true,
                validator: () => {
                  if (isEmpty(getDescription())) {
                    return Promise.reject('Description is required!');
                  }

                  return Promise.resolve();
                },
              },
            ]}>
            <RichTextEditor
              initialValue={initialValue?.description || ''}
              ref={markdownRef}
              style={{
                margin: 0,
              }}
            />
          </Form.Item>
        </>
      ) : (
        <Row className="tw-mb-10" justify="center">
          <Button
            icon={
              <SVGIcons
                alt="plus"
                className="tw-w-4 tw-mr-1"
                icon={Icons.ICON_PLUS_PRIMERY}
              />
            }
            onClick={() => setIsNewTestSuite(true)}>
            <span className="tw-text-primary">Create new test suite</span>
          </Button>
        </Row>
      )}

      <Form.Item noStyle>
        <Space className="tw-w-full tw-justify-end" size={16}>
          <Button onClick={handleCancelClick}>Cancel</Button>
          <Button htmlType="submit" type="primary">
            Next
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SelectTestSuite;
