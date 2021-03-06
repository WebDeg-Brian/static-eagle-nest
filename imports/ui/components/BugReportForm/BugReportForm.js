import React, { Component } from 'react';
import styled from 'styled-components';
import InputsWrapper from '../common/InputsWrapper';
import ImageUploader from '../common/ImageUploader';
import FormValidator, { initValidationState } from '../common/FormValidator';
import validationRules from './validationRules';
import theme from '../../theme';
import isImage from '../../../utils/isImage';
import { TextField, MenuItem, Button } from '@material-ui/core';

const StyledImageUploader = styled(ImageUploader)`
  margin-top: ${theme.spacing.unit * 2}px;
`;

export default class RegisterForm extends Component {
  state = {
    inputs: {
      ...initValidationState(validationRules),
    },
    pass: false,
  };

  handleChange = e => {
    const target = e.target,
      { name, value } = target;

    this.setState(prevState => ({
      inputs: {
        ...prevState.inputs,
        [name]: {
          ...prevState.inputs[name],
          value,
        },
      },
    }));
  };

  handleUpload = e => {
    const target = e.target,
      { name, files } = target,
      imageList = this.state.inputs[name].value,
      pendingImages = [...files]
        .filter(image => isImage(image.name))
        .map(image => ({
          info: image,
          url: URL.createObjectURL(image),
        }))
        .filter(image => imageList.indexOf(image) === -1);

    this.setState(prevState => ({
      inputs: {
        ...prevState.inputs,
        [name]: {
          ...prevState.inputs[name],
          message: pendingImages.length > 0 ? '' : 'This field should only contains images',
          isFakeInvalid: pendingImages.length < 1,
          value: prevState.inputs[name].value.concat(pendingImages),
          fileList: true,
        },
      },
    }));

    target.value = '';
  };

  handleRemove = (name, image) => () => {
    const imageList = this.state.inputs[name].value,
      removeIndex = imageList.indexOf(image);

    this.setState(prevState => ({
      inputs: {
        ...prevState.inputs,
        [name]: {
          ...prevState.inputs[name],
          value: prevState.inputs[name].value.filter((image, index) => index !== removeIndex),
        },
      },
    }));
  };

  handleRemoveAll = name => () => {
    this.setState(prevState => ({
      inputs: {
        ...prevState.inputs,
        [name]: {
          ...prevState.inputs[name],
          value: [],
        },
      },
    }));
  };

  handleBlur = e => {
    const target = e.target,
      { name } = target;

    this.setState(prevState => ({
      inputs: {
        ...prevState.inputs,
        [name]: {
          ...prevState.inputs[name],
          switch: !prevState.inputs[name].switch,
        },
      },
    }));
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  handleValidate = (name, res) => {
    let { inputs } = this.state;

    inputs = {
      ...inputs,
      [name]: {
        ...inputs[name],
        ...res,
      },
    };

    const pass = Object.keys(inputs).filter(key => inputs[key].isInvalid).length <= 0;

    this.setState({
      inputs,
      pass,
    });
  };

  render() {
    const { inputs, pass } = this.state;

    return (
      <form onSubmit={this.handleSubmit} autoComplete="off">
        <InputsWrapper>
          <TextField
            label="Name"
            margin="dense"
            name="name"
            value={inputs.name.value}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            error={inputs.name.isFakeInvalid}
            helperText={inputs.name.message}
            type="text"
            fullWidth
          />
          <TextField
            select
            label="Role"
            margin="dense"
            name="role"
            value={inputs.role.value}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            error={inputs.role.isFakeInvalid}
            helperText={inputs.role.message}
            fullWidth
          >
            <MenuItem value="Teacher">Teacher</MenuItem>
            <MenuItem value="Student">Student</MenuItem>
            <MenuItem value="Houseparent">Houseparent</MenuItem>
            <MenuItem value="Parent">Parent</MenuItem>
          </TextField>
          <TextField
            select
            label="School"
            margin="dense"
            name="school"
            value={inputs.school.value}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            error={inputs.school.isFakeInvalid}
            helperText={inputs.school.message}
            fullWidth
          >
            <MenuItem value="Bosworth Independent College">Bosworth Independent College</MenuItem>
          </TextField>
          <TextField
            label="Email"
            margin="dense"
            name="email"
            value={inputs.email.value}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            error={inputs.email.isFakeInvalid}
            helperText={inputs.email.message}
            type="email"
            fullWidth
          />
          <TextField
            label="Subject"
            margin="dense"
            name="subject"
            value={inputs.subject.value}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            error={inputs.subject.isFakeInvalid}
            helperText={inputs.subject.message}
            fullWidth
          />
          <TextField
            label="Error code (Optional)"
            margin="dense"
            name="code"
            value={inputs.code.value}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            error={inputs.code.isFakeInvalid}
            helperText={inputs.code.message}
            fullWidth
          />
          <TextField
            label="Bug description"
            margin="dense"
            multiline
            rows={4}
            name="description"
            value={inputs.description.value}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            error={inputs.description.isFakeInvalid}
            helperText={inputs.description.message}
            fullWidth
          />
          <StyledImageUploader
            label="Bug image (Optional)"
            id="eagle-bugs-image-upload"
            multiple
            name="images"
            value={inputs.images.value}
            onChange={this.handleUpload}
            onBlur={this.handleBlur}
            onRemove={this.handleRemove}
            onRemoveAll={this.handleRemoveAll}
            error={inputs.images.isFakeInvalid}
            helperText={inputs.images.message}
          />
        </InputsWrapper>
        <Button type="submit" variant="contained" color="primary" disabled={!pass}>
          Submit
        </Button>
        <FormValidator state={inputs} rules={validationRules} onValidate={this.handleValidate} />
      </form>
    );
  }
}
