import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";
import { useState } from "react";
import { AuthToken, User } from "tweeter-shared";

export interface RegisterView {
  setImageUrl(url: string): void;
  displayErrorMessage(message: string): void;
  updateUserInfo(
    currentUser: User,
    displayedUser: User,
    authToken: AuthToken,
    remember: boolean,
  ): void;
  navigate(path: string): void;
}

export class RegisterPresenter {
  private view: RegisterView;
  private _userService: UserService;
  private _isLoading = false;
  private _imageBytes: Uint8Array = new Uint8Array();
  private _imageFileExtension: string = "";
  private _rememberMe = false;
  private _imageUrl = "";

  constructor(view: RegisterView) {
    this.view = view;
    this._userService = new UserService();
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get imageBytes(): Uint8Array {
    return this._imageBytes;
  }

  set imageBytes(value: Uint8Array) {
    this._imageBytes = value;
  }

  get imageFileExtension(): string {
    return this._imageFileExtension;
  }

  set imageFileExtension(value: string) {
    this._imageFileExtension = value;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
  }

  get rememberMe(): boolean {
    return this._rememberMe;
  }

  set rememberMe(value: boolean) {
    this._rememberMe = value;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  set imageUrl(value: string) {
    this._imageUrl = value;
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        this.imageBytes = Buffer.from(
          imageStringBase64BufferContents,
          "base64",
        );
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.imageFileExtension = fileExtension;
      }
    } else {
      this.view.setImageUrl("");
      this._imageBytes = new Uint8Array();
    }
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
  ) {
    try {
      this.isLoading = true;
      const [user, authToken] = await this._userService.register(
        firstName,
        lastName,
        alias,
        password,
        this.imageBytes,
        this.imageFileExtension,
      );
      this.view.updateUserInfo(user, user, authToken, this.rememberMe);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`,
      );
    } finally {
      this.isLoading = false;
    }
  }
}
