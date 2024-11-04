import { Buffer } from "buffer";
import { AuthPresenter, AuthView } from "./AuthPresenter";
import { AuthToken, User } from "tweeter-shared/src";

export interface RegisterView extends AuthView {
  setImageUrl(url: string): void;
}

export class RegisterPresenter extends AuthPresenter<RegisterView> {
  private _imageBytes: Uint8Array = new Uint8Array();
  private _imageFileExtension: string = "";
  private _imageUrl = "";
  private _firstName: string = "";
  private _lastName: string = "";

  constructor(view: RegisterView) {
    super(view);
  }

  get imageBytes(): Uint8Array {
    return this._imageBytes;
  }

  get imageFileExtension(): string {
    return this._imageFileExtension;
  }

  set imageFileExtension(value: string) {
    this._imageFileExtension = value;
  }

  set imageBytes(value: Uint8Array) {
    this._imageBytes = value;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  set lastName(value: string) {
    this._lastName = value;
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

  protected authenticate(): Promise<[User, AuthToken]> {
    return this.userService.register(
      this.firstName,
      this.lastName,
      this.alias,
      this.password,
      this.imageBytes,
      this.imageFileExtension,
    );
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
  ) {
    this.itemDescription = "register";
    this.firstName = alias;
    this.lastName = password;
    await this.doAuthOperation(alias, password, "");
  }
}
