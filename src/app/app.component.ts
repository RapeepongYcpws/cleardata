import { Component, ElementRef, ViewChild } from "@angular/core";
import { first } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  @ViewChild("dvId") dvId: ElementRef | any;
  @ViewChild("cId") cId: ElementRef | any;
  @ViewChild("mb") mb: ElementRef | any;
  public rowList: any = [];
  public sqlTextOpenAccount = "";
  public sqlTextRegistration = "";
  public sqlTextProfiles = "";
  public sqlTextDeposits = "";
  public inp = "";

  ngOnInit() {
    // this.addRow("", "", "");
  }
  addRow(dvId: string, cId: string, mb: string) {
    var row = { dvId: dvId.trim(), cId: cId.trim(), mb: mb.trim() };
    this.rowList = [...this.rowList, row];
    this.dvId.nativeElement.value = "";
    this.cId.nativeElement.value = "";
    this.mb.nativeElement.value = "";
  }
  deleteItem(index: number) {
    var _rowList: any = [];
    for (let i in this.rowList) {
      if (index != parseInt(i)) {
        _rowList = [..._rowList, this.rowList[i]];
      }
    }

    this.rowList = _rowList;
  }
  clearAll() {
    this.rowList = [];
    this.dvId.nativeElement.value = "";
    this.cId.nativeElement.value = "";
    this.mb.nativeElement.value = "";
    this.clearSql();
  }
  clearSql() {
    console.log("CLEAR SQL START");
    this.sqlTextOpenAccount = "";
    this.sqlTextRegistration = "";
    this.sqlTextProfiles = "";
    this.sqlTextDeposits = "";
  }

  generate() {
    if (this.rowList.length > 0) {
      this.clearSql();
      for (let i in this.rowList) {
        var data = this.rowList[i];
        if (i != "0") {
          this.sqlTextOpenAccount += "\n";
          this.sqlTextRegistration += "\n";
          this.sqlTextProfiles += "\n";
          this.sqlTextDeposits += "\n";
        }
        this.result(data.dvId, data.cId, data.mb);
      }
    }
}
  result(dvId: string, cid: string, mb: string) {
    if (dvId != "") {
      this.sqlTextOpenAccount +=
        `delete from tbl_staged_open_account where lower(device_id) = '${dvId}';` +
        "\n";

      this.sqlTextRegistration +=
        `delete from tbl_staged_registration where lower(device_id) = '${dvId}';` +
        "\n";

      this.sqlTextProfiles +=
        `delete from tbl_device_profile where lower(device_id) = '${dvId}';
delete from tbl_user_ekyc where lower(device_id) = '${dvId}';
DELETE FROM tbl_user_preference WHERE lower(user_ref_id) = '${dvId}';
DELETE FROM tbl_profile_transaction_limit WHERE lower(user_ref_id) = '${dvId}';
DELETE FROM tbl_quick_link_favorite WHERE lower(user_ref_id) = '${dvId}';
DELETE FROM tbl_user_quick_actions WHERE lower(user_ref_id) = '${dvId}';` +
        "\n";

      this.sqlTextDeposits +=
        `DELETE FROM tbl_deposit_profile WHERE lower(user_ref_id) = '${dvId}';` +
        "\n";
    }

    if (cid != "") {
      this.sqlTextOpenAccount +=
        `delete from tbl_open_account_face_verification_fail_attempt where cid = '${cid}';
delete from tbl_open_account_rp_attempt where cid = '${cid}';
delete from tbl_open_account_rp_request_info where id_card_number='${cid}';` +
        "\n";

      this.sqlTextRegistration +=
        `delete from tbl_staged_registration where cid = '${cid}';` + "\n";
    }

    if (mb != "") {
      this.sqlTextOpenAccount +=
        `delete from tbl_open_account_dopa_attempt where mobile_no = '${mb}';
delete from tbl_staged_open_account where mobile_no = '${mb}';` + "\n";
    }
    
    this.sqlTextProfiles += 
    `DELETE  from tbl_mobile_detect where detected_mobile_no = '${mb}';
DELETE  from tbl_user_profile where otp_mobile_no = '${mb}';`
  }
}
