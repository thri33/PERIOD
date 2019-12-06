import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CommentComponentsPage, CommentDeleteDialog, CommentUpdatePage } from './comment.page-object';

const expect = chai.expect;

describe('Comment e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let commentComponentsPage: CommentComponentsPage;
  let commentUpdatePage: CommentUpdatePage;
  let commentDeleteDialog: CommentDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Comments', async () => {
    await navBarPage.goToEntity('comment');
    commentComponentsPage = new CommentComponentsPage();
    await browser.wait(ec.visibilityOf(commentComponentsPage.title), 5000);
    expect(await commentComponentsPage.getTitle()).to.eq('periodApp.comment.home.title');
  });

  it('should load create Comment page', async () => {
    await commentComponentsPage.clickOnCreateButton();
    commentUpdatePage = new CommentUpdatePage();
    expect(await commentUpdatePage.getPageTitle()).to.eq('periodApp.comment.home.createOrEditLabel');
    await commentUpdatePage.cancel();
  });

  it('should create and save Comments', async () => {
    const nbButtonsBeforeCreate = await commentComponentsPage.countDeleteButtons();

    await commentComponentsPage.clickOnCreateButton();
    await promise.all([
      commentUpdatePage.setTextInput('text'),
      commentUpdatePage.setCreationDateInput('2000-12-31'),
      commentUpdatePage.postSelectLastOption()
    ]);
    expect(await commentUpdatePage.getTextInput()).to.eq('text', 'Expected Text value to be equals to text');
    expect(await commentUpdatePage.getCreationDateInput()).to.eq('2000-12-31', 'Expected creationDate value to be equals to 2000-12-31');
    await commentUpdatePage.save();
    expect(await commentUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await commentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Comment', async () => {
    const nbButtonsBeforeDelete = await commentComponentsPage.countDeleteButtons();
    await commentComponentsPage.clickOnLastDeleteButton();

    commentDeleteDialog = new CommentDeleteDialog();
    expect(await commentDeleteDialog.getDialogTitle()).to.eq('periodApp.comment.delete.question');
    await commentDeleteDialog.clickOnConfirmButton();

    expect(await commentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
