import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import LoadingScreen from './loading-screen'
import {
  createNewVaultAndRestore,
  hideWarning,
  displayWarning,
  unMarkPasswordForgotten,
  clearNotices,
} from '../../../../ui/app/actions'

class ImportSeedPhraseScreen extends Component {
  static propTypes = {
    warning: PropTypes.string,
    back: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    createNewVaultAndRestore: PropTypes.func.isRequired,
    hideWarning: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    displayWarning: PropTypes.func,
  };

  state = {
    seedPhrase: '',
    password: '',
    confirmPassword: '',
  }

  onClick = () => {
    const { password, seedPhrase, confirmPassword } = this.state
    const { createNewVaultAndRestore, next, displayWarning, leaveImportSeedScreenState } = this.props

    if (seedPhrase.split(' ').length !== 12) {
      this.warning = 'Seed Phrases are 12 words long'
      displayWarning(this.warning)
      return
    }

    if (password.length < 8) {
      this.warning = 'Passwords require a mimimum length of 8'
      displayWarning(this.warning)
      return
    }

    if (password !== confirmPassword) {
      this.warning = 'Confirmed password does not match'
      displayWarning(this.warning)
      return
    }
    this.warning = null
    leaveImportSeedScreenState()
    createNewVaultAndRestore(password, seedPhrase)
      .then(next)
  }

  render () {
    return this.props.isLoading
      ? <LoadingScreen loadingMessage="Creating your new account" />
      : (
        <div className="import-account">
          <a
            className="import-account__back-button"
            onClick={e => {
              e.preventDefault()
              this.props.back()
            }}
            href="#"
          >
            {`< Back`}
          </a>
          <div className="import-account__title">
            Import an Account with Seed Phrase
          </div>
          <div className="import-account__selector-label">
            Enter your secret twelve word phrase here to restore your vault.
          </div>
          <div className="import-account__input-wrapper">
            <label className="import-account__input-label">Wallet Seed</label>
            <textarea
              className="import-account__secret-phrase"
              onChange={e => this.setState({seedPhrase: e.target.value})}
              placeholder="Separate each word with a single space"
            />
          </div>
          <span
            className="error"
          >
            {this.props.warning}
          </span>
          <div className="import-account__input-wrapper">
            <label className="import-account__input-label">New Password</label>
            <input
              className="first-time-flow__input"
              type="password"
              placeholder="New Password (min 8 characters)"
              onChange={e => this.setState({password: e.target.value})}
            />
          </div>
          <div className="import-account__input-wrapper">
            <label className="import-account__input-label">Confirm Password</label>
            <input
              className="first-time-flow__input"
              type="password"
              placeholder="Confirm Password"
              onChange={e => this.setState({confirmPassword: e.target.value})}
            />
          </div>
          <button
            className="first-time-flow__button"
            onClick={this.onClick}
          >
            Import
          </button>
        </div>
      )
  }
}

export default connect(
  ({ appState: { isLoading, warning } }) => ({ isLoading, warning }),
  dispatch => ({
    leaveImportSeedScreenState: () => {
      dispatch(unMarkPasswordForgotten())
    },
    createNewVaultAndRestore: (pw, seed) => dispatch(createNewVaultAndRestore(pw, seed)),
    displayWarning: (warning) => dispatch(displayWarning(warning)),
    hideWarning: () => dispatch(hideWarning()),
  })
)(ImportSeedPhraseScreen)
